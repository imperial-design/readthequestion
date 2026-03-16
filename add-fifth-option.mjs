/**
 * Script to add a 5th answer option to every question in the question bank.
 *
 * Strategy: Parse each .ts file as text, find each question's options array,
 * and append a 5th option at the end. The 5th option is generated based on
 * the question's subject, existing options, and question text.
 */
import fs from 'fs';
import path from 'path';

const BASE = '/Users/rebeccaeverton/11+ Read the Question';

// Files to process (from the user's list)
const FILES = [
  'src/data/questions/english.ts',
  'src/data/questions/maths.ts',
  'src/data/questions/verbal-reasoning.ts',
  'src/data/questions/non-verbal-reasoning.ts',
  'src/data/questions/new-english.ts',
  'src/data/questions/new-verbal-reasoning.ts',
  'src/data/questions/new-maths.ts',
  'src/data/questions/batch2-english.ts',
  'src/data/questions/batch2-verbal-reasoning.ts',
  'src/data/tutorialQuestion.ts',
];

/**
 * Parse a question block from the source text.
 * Returns structured info about the question.
 */
function parseQuestionInfo(questionBlock) {
  const idMatch = questionBlock.match(/id:\s*'([^']+)'/);
  const subjectMatch = questionBlock.match(/subject:\s*'([^']+)'/);
  const questionTextMatch = questionBlock.match(/questionText:\s*(?:'([^']*(?:\\'[^']*)*)'|"([^"]*(?:\\"[^"]*)*)")/s);
  const correctIndexMatch = questionBlock.match(/correctOptionIndex:\s*(\d+)/);
  const categoryMatch = questionBlock.match(/category:\s*'([^']+)'/);

  // Extract option texts
  const optionTexts = [];
  const optionRegex = /\{\s*text:\s*(?:'([^']*(?:\\'[^']*)*)'|"([^"]*(?:\\"[^"]*)*)")/g;
  let m;
  while ((m = optionRegex.exec(questionBlock)) !== null) {
    optionTexts.push(m[1] || m[2]);
  }

  return {
    id: idMatch ? idMatch[1] : 'unknown',
    subject: subjectMatch ? subjectMatch[1] : 'unknown',
    questionText: questionTextMatch ? (questionTextMatch[1] || questionTextMatch[2] || '') : '',
    correctOptionIndex: correctIndexMatch ? parseInt(correctIndexMatch[1]) : 0,
    category: categoryMatch ? categoryMatch[1] : '',
    optionTexts,
    optionCount: optionTexts.length,
  };
}

/**
 * Check if an options array already has 5+ options.
 */
function hasEnoughOptions(optionTexts) {
  return optionTexts.length >= 5;
}

/**
 * Process a single file: find each question and add a 5th option.
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // We'll find each options array and add a 5th option if it only has 4
  // Strategy: find each `options: [` block and its closing `],`
  // Then insert the 5th option before the closing `],`

  // Find all question blocks - they start with `{` after `[` or `,` and contain `id:`, `options:`, `correctOptionIndex:`
  // More reliable: find each `options: [` and match the complete array

  const questionBlocks = [];
  let searchFrom = 0;

  while (true) {
    const optionsStart = content.indexOf('options: [', searchFrom);
    if (optionsStart === -1) break;

    // Find the matching closing bracket
    let depth = 0;
    let bracketStart = content.indexOf('[', optionsStart);
    let i = bracketStart;
    for (; i < content.length; i++) {
      if (content[i] === '[') depth++;
      else if (content[i] === ']') {
        depth--;
        if (depth === 0) break;
      }
    }
    const bracketEnd = i; // position of closing ]

    const optionsContent = content.substring(bracketStart + 1, bracketEnd);

    // Count how many options (count occurrences of `{ text:`)
    const optionCount = (optionsContent.match(/\{\s*text:/g) || []).length;

    // Find the enclosing question block - search backwards for the question's opening {
    // and forward for its correctOptionIndex
    let qBlockStart = optionsStart;
    // Go back to find `id:`
    let idPos = content.lastIndexOf("id: '", optionsStart);
    if (idPos === -1) idPos = content.lastIndexOf('id: "', optionsStart);
    if (idPos > 0) {
      // Go back more to find the opening {
      let bracePos = content.lastIndexOf('{', idPos);
      if (bracePos > 0) qBlockStart = bracePos;
    }

    // Find end of question block (next correctOptionIndex line + a few lines)
    let qBlockEnd = content.indexOf('correctOptionIndex:', bracketEnd);
    if (qBlockEnd > 0) {
      qBlockEnd = content.indexOf('\n', qBlockEnd + 20);
      // Also capture explanation and category
      let nextBrace = content.indexOf('},', qBlockEnd);
      let nextSemicolon = content.indexOf('};', qBlockEnd);
      if (nextBrace > 0 && (nextSemicolon < 0 || nextBrace < nextSemicolon)) {
        qBlockEnd = nextBrace + 2;
      } else if (nextSemicolon > 0) {
        qBlockEnd = nextSemicolon + 2;
      }
    }

    const questionBlock = content.substring(qBlockStart, qBlockEnd);
    const info = parseQuestionInfo(questionBlock);

    questionBlocks.push({
      optionsStart: bracketStart,
      optionsEnd: bracketEnd,
      optionsContent,
      optionCount,
      info,
    });

    searchFrom = bracketEnd + 1;
  }

  // Process in reverse order so string positions don't shift
  let modifications = 0;
  for (let qi = questionBlocks.length - 1; qi >= 0; qi--) {
    const q = questionBlocks[qi];
    if (q.optionCount >= 5) {
      continue; // Already has 5+ options
    }
    if (q.optionCount < 4) {
      console.log(`  WARNING: ${q.info.id} has only ${q.optionCount} options, skipping`);
      continue;
    }

    const fifthOption = generateFifthOption(q.info);
    if (!fifthOption) {
      console.log(`  WARNING: Could not generate 5th option for ${q.info.id}`);
      continue;
    }

    // Find the insertion point - just before the closing ]
    // We need to find the last } in the options array (end of 4th option)
    const optContent = q.optionsContent;

    // Find the last } that closes the 4th option object
    let lastBracePos = -1;
    {
      let depth = 0;
      for (let i = optContent.length - 1; i >= 0; i--) {
        if (optContent[i] === '}') {
          if (depth === 0) {
            lastBracePos = i;
            break;
          }
          depth++;
        } else if (optContent[i] === '{') {
          depth--;
        }
      }
    }

    if (lastBracePos === -1) {
      console.log(`  WARNING: Could not find last option brace for ${q.info.id}`);
      continue;
    }

    // Determine indentation - find the indentation of existing options
    const indentMatch = optContent.match(/\n(\s+)\{ text:/);
    const indent = indentMatch ? indentMatch[1] : '      ';

    // Build the 5th option string
    const escapedText = fifthOption.text.replace(/'/g, "\\'");
    const escapedReason = fifthOption.reason.replace(/'/g, "\\'");
    const newOption = `\n${indent}{ text: '${escapedText}', isEliminatable: true, eliminationReason: '${escapedReason}' },`;

    // Insert after the last option's closing }
    const absoluteInsertPos = q.optionsStart + 1 + lastBracePos + 1;

    // Check if there's a comma after the last }
    const afterLastBrace = content.substring(absoluteInsertPos, absoluteInsertPos + 5);
    let insertText = newOption;
    if (!afterLastBrace.trimStart().startsWith(',')) {
      // Need to add comma after previous option
      insertText = ',' + newOption;
      // Actually, let me check if there already is a trailing comma
    }

    // Most TypeScript files have trailing commas, so the format is:
    // { text: '...', ... },
    // So we just need to add the new option after the last one
    // Let's find the position right after the last option's closing },
    // by looking for }, pattern

    const optionsText = content.substring(q.optionsStart + 1, q.optionsEnd);

    // Find the last }, in the options
    let insertAfterPos = -1;
    {
      // Search for the last occurrence of '},\n' or '}, \n' or just '},'
      let lastCommaAfterBrace = optionsText.lastIndexOf('},');
      if (lastCommaAfterBrace >= 0) {
        insertAfterPos = q.optionsStart + 1 + lastCommaAfterBrace + 2; // after the comma
      } else {
        // No trailing comma - find last }
        let lastB = optionsText.lastIndexOf('}');
        if (lastB >= 0) {
          insertAfterPos = q.optionsStart + 1 + lastB + 1;
          insertText = ',' + newOption; // add comma before new option
        }
      }
    }

    if (insertAfterPos === -1) {
      console.log(`  WARNING: Could not find insertion point for ${q.info.id}`);
      continue;
    }

    // Insert the new option
    content = content.substring(0, insertAfterPos) + newOption + content.substring(insertAfterPos);
    modifications++;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  Modified ${modifications} questions in ${path.basename(filePath)}`);
  return modifications;
}

/**
 * Generate a contextually appropriate 5th option for a question.
 */
function generateFifthOption(info) {
  const { id, subject, questionText, correctOptionIndex, category, optionTexts } = info;
  const qt = questionText.toLowerCase();
  const correctAnswer = optionTexts[correctOptionIndex] || '';

  // Subject-specific generation
  if (subject === 'english' || (subject === 'verbal-reasoning' && category?.startsWith('comprehension'))) {
    return generateEnglishFifthOption(info);
  } else if (subject === 'maths') {
    return generateMathsFifthOption(info);
  } else if (subject === 'verbal-reasoning') {
    return generateVerbalReasoningFifthOption(info);
  } else if (subject === 'non-verbal-reasoning') {
    return generateNonVerbalReasoningFifthOption(info);
  }

  // Fallback
  return {
    text: 'Cannot be determined from the information given',
    reason: 'The passage provides enough information to answer the question — a careful reader can find the answer.',
  };
}

function generateEnglishFifthOption(info) {
  const { id, questionText, correctOptionIndex, category, optionTexts } = info;
  const qt = questionText.toLowerCase();
  const correct = optionTexts[correctOptionIndex] || '';

  // Comprehension-who questions
  if (category === 'comprehension-who' || qt.includes('who ')) {
    const names = extractNames(questionText);
    const usedNames = optionTexts.map(t => t.toLowerCase());
    const unusedName = names.find(n => !usedNames.some(u => u.includes(n.toLowerCase())));

    if (qt.includes('who gave') || qt.includes('who carried') || qt.includes('who packed') || qt.includes('who decorated') || qt.includes('who read')) {
      return {
        text: 'They all shared the task',
        reason: 'The passage describes one specific person doing the action, not a shared task. A rusher might assume everyone helped equally.',
      };
    }
    if (qt.includes('who won') || qt.includes('who did best') || qt.includes('who ran faster') || qt.includes('whose painting') || qt.includes('who asked')) {
      return {
        text: 'The passage does not give enough information',
        reason: 'The passage clearly states the answer. A careful reader can identify who did what by reading every sentence.',
      };
    }
    if (qt.includes('who scored') || qt.includes('which year') || qt.includes('which team')) {
      return {
        text: 'The results were not recorded',
        reason: 'The passage provides specific numbers, so the results are clearly recorded.',
      };
    }
    // Generic who
    return {
      text: 'It is impossible to tell',
      reason: 'The passage gives enough detail to identify who did what. Read each sentence carefully and match names to actions.',
    };
  }

  // Comprehension-when
  if (category === 'comprehension-when' || qt.includes('when ') || qt.includes('what time') || qt.includes('what day')) {
    if (qt.includes('saturday') || qt.includes('friday') || qt.includes('thursday') || qt.includes('wednesday') || qt.includes('tuesday') || qt.includes('monday') || qt.includes('sunday')) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const usedDays = optionTexts.map(t => t.toLowerCase());
      const unusedDay = days.find(d => !usedDays.some(u => u.toLowerCase().includes(d.toLowerCase())) && !qt.includes(d.toLowerCase()));
      if (unusedDay) {
        return {
          text: unusedDay,
          reason: `${unusedDay} is not mentioned in the passage. A rusher might guess a day without checking the passage carefully.`,
        };
      }
    }
    if (qt.includes('time') || qt.includes('o\'clock') || qt.includes('am') || qt.includes('pm') || qt.includes(':')) {
      return {
        text: 'The passage does not mention a specific time',
        reason: 'The passage does give specific time information. A careful reader can identify the exact time by reading each detail.',
      };
    }
    return {
      text: 'The passage does not say',
      reason: 'The passage does provide this information. A careful reader can find the answer by matching events to times.',
    };
  }

  // Comprehension-where
  if (category === 'comprehension-where' || qt.includes('where ')) {
    if (qt.includes('library') && !optionTexts.some(t => t.toLowerCase().includes('park'))) {
      return { text: 'At the park', reason: 'The park is not mentioned in the passage. A rusher might guess a familiar location without reading carefully.' };
    }
    if (qt.includes('school') && !optionTexts.some(t => t.toLowerCase().includes('park'))) {
      return { text: 'In the park', reason: 'The park is not mentioned in the passage. A rusher might confuse it with another familiar location.' };
    }
    if (qt.includes('museum') && !optionTexts.some(t => t.toLowerCase().includes('cinema'))) {
      return { text: 'The cinema', reason: 'The cinema is not mentioned in the passage. A rusher might guess a similar outing location.' };
    }
    return {
      text: 'The passage does not say where',
      reason: 'The passage does give location information. Read carefully to match each place to the right person or event.',
    };
  }

  // Comprehension-how-many
  if (category === 'comprehension-how-many' || qt.includes('how many') || qt.includes('how much')) {
    // Try to find a plausible number
    const numbers = questionText.match(/\d+/g) || [];
    const usedNums = optionTexts.map(t => {
      const m = t.match(/\d+/);
      return m ? parseInt(m[0]) : null;
    }).filter(n => n !== null);

    // Generate a plausible wrong number
    const allNums = numbers.map(n => parseInt(n));
    for (const n of allNums) {
      const candidates = [n + 1, n - 1, n + 2, n * 2, Math.floor(n / 2)].filter(c => c > 0);
      for (const c of candidates) {
        if (!usedNums.includes(c) && c !== 0) {
          return {
            text: optionTexts[0].match(/^[£$]/) ? `${optionTexts[0][0]}${c}` : String(c),
            reason: `${c} does not match any calculation from the passage. A rusher might miscount or use the wrong numbers.`,
          };
        }
      }
    }
    return {
      text: 'The information is not given',
      reason: 'The passage provides enough numbers to answer the question. A careful reader can calculate the correct answer.',
    };
  }

  // Comprehension-what
  if (category === 'comprehension-what' || qt.includes('what ')) {
    return {
      text: 'The passage does not make this clear',
      reason: 'The passage does clearly state the answer. A careful reader can find it by matching details to the right person or event.',
    };
  }

  // Comprehension-why
  if (category === 'comprehension-why' || qt.includes('why ')) {
    return {
      text: 'There is no reason given in the passage',
      reason: 'The passage does explain the reason. A careful reader can find the cause by looking for linking words like "because", "so", or "since".',
    };
  }

  // Comprehension-inference
  if (category === 'comprehension-inference') {
    return {
      text: 'There is not enough information to answer',
      reason: 'The passage gives enough clues to work out the answer by reading between the lines.',
    };
  }

  // Vocabulary
  if (category?.includes('synonym') || category?.includes('antonym') || category?.includes('vocabulary')) {
    // Try to find a word related to the topic but wrong
    if (qt.includes('opposite') || qt.includes('antonym')) {
      return {
        text: 'Thoughtful',
        reason: 'Thoughtful does not mean the opposite of the given word. Check each option carefully to find the true opposite.',
      };
    }
    if (qt.includes('synonym') || qt.includes('closest in meaning')) {
      return {
        text: 'Gentle',
        reason: 'Gentle is not a synonym for the given word. A synonym must have a very similar meaning.',
      };
    }
    return {
      text: 'Pleasant',
      reason: 'Pleasant is a positive word but does not match the meaning asked for in the question.',
    };
  }

  // Default for English
  return {
    text: 'The passage does not give enough detail to answer',
    reason: 'The passage does contain the answer. A careful reader can find it by reading every sentence and matching details precisely.',
  };
}

function generateMathsFifthOption(info) {
  const { questionText, correctOptionIndex, category, optionTexts } = info;
  const qt = questionText.toLowerCase();
  const correct = optionTexts[correctOptionIndex] || '';

  // Extract numbers from options to find plausible wrong numbers
  const optionNums = optionTexts.map(t => {
    const m = t.replace(/[£$,\s]/g, '').match(/-?[\d.]+/);
    return m ? parseFloat(m[0]) : null;
  });
  const correctNum = optionNums[correctOptionIndex];

  // Try to generate a plausible wrong number
  if (correctNum !== null && correctNum !== undefined) {
    const existingNums = new Set(optionNums.filter(n => n !== null));

    // Generate candidates based on common calculation errors
    const candidates = [];
    candidates.push({ val: correctNum + 1, reason: `This is ${correctNum + 1}, which could result from adding 1 too many. The correct calculation gives ${correctNum}.` });
    candidates.push({ val: correctNum - 1, reason: `This is close to the correct answer but is off by 1, a common arithmetic slip.` });
    candidates.push({ val: correctNum + 2, reason: `This comes from a slight miscalculation. Double-check each step of the working.` });
    candidates.push({ val: correctNum - 2, reason: `This comes from subtracting too much. Check the calculation step by step.` });
    candidates.push({ val: correctNum * 2, reason: `This is double the correct answer. A rusher might multiply when they should not.` });
    candidates.push({ val: correctNum * 3, reason: `This could result from multiplying instead of adding, or using the wrong operation.` });
    candidates.push({ val: Math.round(correctNum * 1.5), reason: `This comes from a calculation error — perhaps using the wrong fraction or percentage.` });
    candidates.push({ val: correctNum + 5, reason: `This does not match the correct calculation. A rusher might use the wrong numbers from the question.` });
    candidates.push({ val: correctNum + 10, reason: `This is too high. A rusher might add extra numbers that are not part of the calculation.` });
    if (correctNum > 3) {
      candidates.push({ val: correctNum - 3, reason: `This comes from a subtraction error. Check each step carefully.` });
    }
    if (correctNum > 5) {
      candidates.push({ val: Math.round(correctNum / 2), reason: `This is half the correct answer. A rusher might divide when they should not.` });
    }

    // Find first candidate that's not already used, positive, and different from correct
    for (const c of candidates) {
      if (c.val > 0 && !existingNums.has(c.val) && c.val !== correctNum) {
        // Format to match existing option style
        const prefix = correct.match(/^[£$]/)?.[0] || '';
        const suffix = correct.match(/\s*(m|cm|mm|km|kg|g|ml|l|p|%|°|°C)$/)?.[0] || '';
        let formatted;
        if (correct.includes('/')) {
          // It's a fraction - skip fancy formatting
          formatted = String(c.val);
        } else if (correct.includes('.') && !correct.includes(':')) {
          formatted = `${prefix}${c.val.toFixed(correct.split('.')[1]?.replace(/[^0-9]/g, '').length || 2)}${suffix}`;
        } else if (correct.includes(':')) {
          // Ratio format
          formatted = String(c.val);
        } else {
          formatted = `${prefix}${c.val}${suffix}`;
        }
        return { text: formatted, reason: c.reason };
      }
    }
  }

  // Fallback for maths
  return {
    text: 'None of the above',
    reason: 'One of the other options is correct. Check your calculation carefully step by step.',
  };
}

function generateVerbalReasoningFifthOption(info) {
  const { questionText, correctOptionIndex, category, optionTexts } = info;
  const qt = questionText.toLowerCase();
  const correct = optionTexts[correctOptionIndex] || '';

  // Synonym/antonym questions
  if (category?.includes('synonym') || qt.includes('closest in meaning') || qt.includes('synonym')) {
    if (qt.includes('happy') || qt.includes('joy')) {
      return { text: 'Content', reason: 'Content can mean happy, so it IS a synonym. The question asks for the word that is NOT closest in meaning.' };
    }
    if (qt.includes('gloomy') || qt.includes('sad') || qt.includes('dark')) {
      return { text: 'Murky', reason: 'Murky means dark or unclear, which is similar to gloomy. It is not the correct answer because the question asks for the one that is NOT a synonym.' };
    }
    return { text: 'Steady', reason: 'Steady does not match the meaning of the given word. Check each option against the original word carefully.' };
  }

  if (category?.includes('antonym') || qt.includes('opposite')) {
    return { text: 'Curious', reason: 'Curious does not mean the opposite of the given word. The true opposite must have a directly contrasting meaning.' };
  }

  // Odd-one-out
  if (category?.includes('odd-one-out') || qt.includes('odd one out') || qt.includes('does not belong')) {
    return { text: 'They all belong to the same group', reason: 'Three of the words do belong together, but one does not. Look carefully at what the words have in common.' };
  }

  // Code/cipher questions
  if (category?.includes('code') || qt.includes('code') || qt.includes('cipher')) {
    return { text: 'The code cannot be worked out', reason: 'The code can be worked out from the information given. Apply the rule systematically to each letter.' };
  }

  // Anagram / rearrange
  if (qt.includes('rearrange') || qt.includes('letters') && qt.includes('make a word')) {
    return { text: 'There is no valid word', reason: 'The letters do form a valid English word. Try different arrangements until you find it.' };
  }

  // Letter move questions
  if (qt.includes('move one letter') || qt.includes('move a letter')) {
    return { text: 'No letter can be moved to make two words', reason: 'One of the letters can be moved to make two valid words. Try each letter one at a time.' };
  }

  // Comprehension within VR
  if (category?.startsWith('comprehension')) {
    return generateEnglishFifthOption(info);
  }

  // Number sequence in VR
  if (qt.includes('sequence') || qt.includes('what comes next') || qt.includes('next number')) {
    const optNums = optionTexts.map(t => parseInt(t)).filter(n => !isNaN(n));
    const maxOpt = Math.max(...optNums);
    const candidate = maxOpt + 2;
    if (!optNums.includes(candidate)) {
      return { text: String(candidate), reason: `${candidate} does not follow the pattern. Work out the rule by looking at the differences between consecutive numbers.` };
    }
    return { text: String(maxOpt + 3), reason: 'This does not match the pattern. Check the rule carefully by finding the gap between each pair of numbers.' };
  }

  // Hidden word
  if (qt.includes('hidden') || qt.includes('hidden word') || qt.includes('spans across')) {
    return { text: 'There is no hidden word', reason: 'There is a word hidden across the word boundaries. Look at where one word ends and the next begins.' };
  }

  // Default VR
  return {
    text: 'None of these is correct',
    reason: 'One of the other options is the correct answer. Read the question again carefully and apply the rule step by step.',
  };
}

function generateNonVerbalReasoningFifthOption(info) {
  const { questionText, correctOptionIndex, category, optionTexts } = info;
  const qt = questionText.toLowerCase();
  const correct = optionTexts[correctOptionIndex] || '';

  // Code/value questions
  if (category?.includes('code') || qt.includes('value') || qt.includes('code') || qt.includes('cipher')) {
    const optNums = optionTexts.map(t => parseInt(t)).filter(n => !isNaN(n));
    if (optNums.length >= 3) {
      const maxOpt = Math.max(...optNums);
      const candidates = [maxOpt + 1, maxOpt + 2, maxOpt + 3];
      for (const c of candidates) {
        if (!optNums.includes(c)) {
          return { text: String(c), reason: `${c} comes from adding the values incorrectly. Check each letter's value and add them up carefully.` };
        }
      }
    }
    // For code/cipher that produce text
    if (correct.match(/^[A-Z]+$/)) {
      return { text: 'The code cannot be decoded', reason: 'The code can be decoded by applying the given rule to each letter. Work through it step by step.' };
    }
    return { text: 'The values cannot be calculated', reason: 'The values can be calculated using the given code. Apply the rule to each letter systematically.' };
  }

  // Sequence questions
  if (category?.includes('sequence') || qt.includes('sequence') || qt.includes('next') || qt.includes('pattern')) {
    const optNums = optionTexts.map(t => parseInt(t)).filter(n => !isNaN(n));
    if (optNums.length >= 3) {
      const maxOpt = Math.max(...optNums);
      const candidate = maxOpt + 2;
      if (!optNums.includes(candidate)) {
        return { text: String(candidate), reason: `${candidate} does not fit the pattern. Work out the rule by checking the gap between each number.` };
      }
    }
    return { text: 'The pattern cannot be determined', reason: 'The pattern can be determined from the numbers given. Look at the differences or ratios between consecutive terms.' };
  }

  // Direction questions
  if (category?.includes('direction') || qt.includes('direction') || qt.includes('facing') || qt.includes('turn')) {
    const directions = ['North', 'South', 'East', 'West'];
    const used = optionTexts.map(t => t.toLowerCase());
    const unused = directions.find(d => !used.some(u => u.toLowerCase().includes(d.toLowerCase())));
    if (unused) {
      return { text: unused, reason: `Turning the described way from the starting direction does not lead to ${unused}. Trace each turn one at a time.` };
    }
    return { text: 'North-East', reason: 'The question involves turning 90 degrees, which leads to a cardinal direction (North, South, East, or West), not a diagonal.' };
  }

  // Venn / sorting questions
  if (category?.includes('venn') || qt.includes('group') || qt.includes('set') || qt.includes('box') || qt.includes('sort') || qt.includes('shelf') || qt.includes('rule')) {
    if (qt.includes('how many') || qt.includes('belong')) {
      // Numeric answer
      const optNums = optionTexts.map(t => parseInt(t)).filter(n => !isNaN(n));
      const maxN = Math.max(...optNums, 0);
      const candidate = maxN + 1;
      if (!optNums.includes(candidate)) {
        return { text: String(candidate), reason: `${candidate} is not the correct count. Apply the sorting rule to each item one at a time and count carefully.` };
      }
    }
    if (qt.includes('which statement') || qt.includes('which group') || qt.includes('which set')) {
      return { text: 'It does not belong in any set', reason: 'Every item fits into at least one of the defined groups. Apply the rule carefully to determine which group.' };
    }
    return { text: 'The rule does not apply here', reason: 'The rule does apply — read it carefully and check each condition one at a time.' };
  }

  // Grid/position questions
  if (category?.includes('grid') || qt.includes('left') || qt.includes('right') || qt.includes('order')) {
    return { text: 'You cannot work out the order', reason: 'The passage gives enough clues to determine the order. Work through each statement one at a time.' };
  }

  // Analogy questions
  if (category?.includes('analogy') || qt.includes('is to') || qt.includes('as ... is to')) {
    return { text: 'None of the above fits the pattern', reason: 'One of the options does complete the analogy correctly. Find the relationship between the first pair and apply it to the second.' };
  }

  // Default NVR
  return {
    text: 'There is not enough information to solve this',
    reason: 'The question provides all the information needed. Work through the problem step by step, applying each rule carefully.',
  };
}

/**
 * Extract proper names from a question text.
 */
function extractNames(text) {
  // Common names pattern - capitalized words that aren't at start of sentence
  const names = [];
  const words = text.split(/\s+/);
  const commonWords = new Set(['The', 'A', 'An', 'In', 'On', 'At', 'For', 'But', 'And', 'Or', 'So', 'Yet', 'If', 'When', 'Where', 'Who', 'What', 'How', 'Why', 'Which', 'She', 'He', 'They', 'Her', 'His', 'However', 'Although', 'Despite', 'Meanwhile', 'Instead', 'Nevertheless', 'Whose', 'Because', 'Before', 'After', 'Only', 'Both', 'Neither', 'Each', 'Every', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Year', 'Class', 'Mrs', 'Mr', 'Miss', 'Dr']);

  for (const w of words) {
    const clean = w.replace(/[^a-zA-Z]/g, '');
    if (clean.length > 1 && clean[0] === clean[0].toUpperCase() && clean[0] !== clean[0].toLowerCase() && !commonWords.has(clean)) {
      names.push(clean);
    }
  }
  return [...new Set(names)];
}

// Main
console.log('Adding 5th options to question files...\n');
let totalMods = 0;

for (const file of FILES) {
  const fullPath = path.join(BASE, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`  SKIPPED: ${file} (not found)`);
    continue;
  }
  console.log(`Processing ${file}...`);
  totalMods += processFile(fullPath);
}

console.log(`\nDone! Modified ${totalMods} questions across ${FILES.length} files.`);
