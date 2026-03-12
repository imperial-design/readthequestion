#!/usr/bin/env python3
"""
Generate the CLEAR Method Crib Sheet — A4 printable PDF
AnswerTheQuestion! by Rebecca Everton

v3 — Scaled up fonts & spacing to fill full A4 page
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, Color
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
import os

# ── Colours ──────────────────────────────────────────────
PURPLE       = HexColor("#7c3aed")
PURPLE_DARK  = HexColor("#5b21b6")
PURPLE_LIGHT = HexColor("#ede9fe")
PURPLE_MID   = HexColor("#c4b5fd")
PINK         = HexColor("#ec4899")
ORANGE       = HexColor("#f97316")
BLUE         = HexColor("#3b82f6")
BLUE_LIGHT   = HexColor("#dbeafe")
GREEN        = HexColor("#22c55e")
GREEN_LIGHT  = HexColor("#dcfce7")
TEAL         = HexColor("#0d9488")
TEAL_LIGHT   = HexColor("#ccfbf1")
TEAL_MID     = HexColor("#99f6e4")
PINK_LIGHT   = HexColor("#fce7f3")
ORANGE_LIGHT = HexColor("#fff7ed")
GRAY_800     = HexColor("#1f2937")
GRAY_600     = HexColor("#4b5563")
GRAY_400     = HexColor("#9ca3af")
WHITE        = white

# ── Page setup ───────────────────────────────────────────
WIDTH, HEIGHT = A4  # 210mm x 297mm
MARGIN = 10 * mm
CONTENT_W = WIDTH - 2 * MARGIN

# ── Helpers ──────────────────────────────────────────────

def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, stroke_width=0.5):
    c.saveState()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
    else:
        c.setStrokeColor(fill_color if fill_color else WHITE)
        c.setLineWidth(0)
    p = c.beginPath()
    p.roundRect(x, y, w, h, r)
    p.close()
    if fill_color and stroke_color:
        c.drawPath(p, fill=1, stroke=1)
    elif fill_color:
        c.drawPath(p, fill=1, stroke=0)
    elif stroke_color:
        c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def draw_gradient_rect(c, x, y, w, h, color_left, color_right, steps=60):
    strip_w = w / steps
    for i in range(steps):
        t = i / (steps - 1)
        r = color_left.red   + t * (color_right.red   - color_left.red)
        g = color_left.green + t * (color_right.green - color_left.green)
        b = color_left.blue  + t * (color_right.blue  - color_left.blue)
        c.setFillColor(Color(r, g, b))
        c.rect(x + i * strip_w, y, strip_w + 0.5, h, fill=1, stroke=0)


def draw_circle(c, cx, cy, r, fill_color):
    c.saveState()
    c.setFillColor(fill_color)
    c.circle(cx, cy, r, fill=1, stroke=0)
    c.restoreState()


def draw_text(c, x, y, text, font="Helvetica", size=10, color=GRAY_800):
    c.saveState()
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, text)
    c.restoreState()


def draw_text_centered(c, x, y, text, font="Helvetica", size=10, color=GRAY_800):
    c.saveState()
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawCentredString(x, y, text)
    c.restoreState()


def draw_paragraph(c, x, y, width, text, font="Helvetica", size=9, color=GRAY_600, leading=12):
    style = ParagraphStyle(
        'custom',
        fontName=font,
        fontSize=size,
        textColor=color,
        leading=leading,
        alignment=TA_LEFT,
    )
    p = Paragraph(text, style)
    pw, ph = p.wrap(width, 500)
    p.drawOn(c, x, y - ph)
    return ph


def draw_bullet_list(c, x, y, w, items, bullet_color, bullet_style="circle",
                     font_size=8, leading=10.2, text_color=GRAY_800):
    """Draw a list of items with bullets. Returns total height used."""
    item_y = y
    for item in items:
        if bullet_style == "circle":
            draw_circle(c, x + 2.2 * mm, item_y + 1.4 * mm, 1 * mm, bullet_color)
        elif bullet_style == "star":
            draw_text(c, x + 0.8 * mm, item_y - 0.3 * mm, "\u2605", "Helvetica", 6.5, bullet_color)
        elif bullet_style == "arrow":
            draw_text(c, x + 0.8 * mm, item_y - 0.3 * mm, "\u25B8", "Helvetica", 7.5, bullet_color)

        text_x = x + 6 * mm
        avail_w = w - 8 * mm
        ph = draw_paragraph(c, text_x, item_y + 3 * mm, avail_w, item,
                            "Helvetica", font_size, text_color, leading=leading)
        item_y -= max(ph + 1.5 * mm, 5 * mm)
    return y - item_y


def draw_checklist(c, x, y, w, items, accent_color,
                   font_size=8, leading=10.2, text_color=GRAY_800):
    """Draw a list of items with checkboxes. Returns total height used."""
    item_y = y
    for item in items:
        cb_x = x + 1.5 * mm
        cb_size = 3 * mm
        draw_rounded_rect(c, cb_x, item_y - 0.5 * mm, cb_size, cb_size, 0.5 * mm,
                          fill_color=WHITE, stroke_color=accent_color, stroke_width=0.6)
        text_x = cb_x + 5 * mm
        avail_w = w - 8.5 * mm
        ph = draw_paragraph(c, text_x, item_y + 3 * mm, avail_w, item,
                            "Helvetica", font_size, text_color, leading=leading)
        item_y -= max(ph + 1.5 * mm, 5 * mm)
    return y - item_y


# ── Main PDF Generation ─────────────────────────────────

def create_crib_sheet():
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "CLEAR-Method-Crib-Sheet.pdf")
    c = canvas.Canvas(output_path, pagesize=A4)
    c.setTitle("The CLEAR Method Crib Sheet \u2014 AnswerTheQuestion!")
    c.setAuthor("AnswerTheQuestion!")
    c.setSubject("11+ Exam Technique Crib Sheet")

    # ─────────────────────────────────────────────────────
    # 1. HEADER — Gradient banner
    # ─────────────────────────────────────────────────────
    header_h = 50 * mm
    header_y = HEIGHT - header_h

    draw_gradient_rect(c, 0, header_y, WIDTH, header_h, PURPLE_DARK, PINK)

    # Decorative circles
    c.saveState()
    c.setFillColor(Color(1, 1, 1, 0.06))
    c.circle(28 * mm, header_y + 40 * mm, 18 * mm, fill=1, stroke=0)
    c.circle(WIDTH - 22 * mm, header_y + 12 * mm, 14 * mm, fill=1, stroke=0)
    c.circle(WIDTH / 2 + 38 * mm, header_y + 44 * mm, 10 * mm, fill=1, stroke=0)
    c.restoreState()

    # Branding
    draw_text_centered(c, WIDTH / 2, header_y + header_h - 12 * mm,
                       "AnswerTheQuestion!", "Helvetica-Bold", 11, Color(1, 1, 1, 0.85))
    # Title
    draw_text_centered(c, WIDTH / 2, header_y + header_h - 23 * mm,
                       "The CLEAR Method Crib Sheet", "Helvetica-Bold", 23, WHITE)
    # Subtitle
    draw_text_centered(c, WIDTH / 2, header_y + header_h - 33 * mm,
                       "Keep next to you during homework, revision and practice papers",
                       "Helvetica", 10, Color(1, 1, 1, 0.8))
    # Tagline
    draw_text_centered(c, WIDTH / 2, header_y + header_h - 43 * mm,
                       "\"When the screens are off and the pen is in hand, make sure the principles are still close.\"",
                       "Helvetica-Oblique", 8.5, Color(1, 1, 1, 0.55))

    cursor_y = header_y - 4 * mm

    # ─────────────────────────────────────────────────────
    # 2. THE 5 CLEAR METHOD STEPS
    # ─────────────────────────────────────────────────────
    steps = [
        ("C", "Calm",      "Take a breath before you start. A calm brain thinks more clearly.",
         BLUE, BLUE_LIGHT),
        ("L", "Look",      "Read the whole question. Then read it again. What is it actually asking?",
         PURPLE, PURPLE_LIGHT),
        ("E", "Eliminate",  "Cross out answers that are obviously wrong. Fewer choices = better thinking.",
         PINK, PINK_LIGHT),
        ("A", "Answer",     "Now pick your answer \u2014 with confidence, not panic.",
         ORANGE, ORANGE_LIGHT),
        ("R", "Review",     "Read your answer back against the question. Does it match what was asked?",
         GREEN, GREEN_LIGHT),
    ]

    step_h = 15 * mm
    step_gap = 2 * mm

    for letter, name, desc, accent, bg in steps:
        sy = cursor_y - step_h

        # Card
        draw_rounded_rect(c, MARGIN, sy, CONTENT_W, step_h, 3 * mm, fill_color=bg)
        # Left accent bar
        draw_rounded_rect(c, MARGIN, sy, 2.8 * mm, step_h, 1.2 * mm, fill_color=accent)
        # Letter circle
        cx = MARGIN + 12 * mm
        cy = sy + step_h / 2
        draw_circle(c, cx, cy, 5 * mm, accent)
        draw_text_centered(c, cx, cy - 3, letter, "Helvetica-Bold", 14, WHITE)
        # Name + description
        tx = MARGIN + 22 * mm
        draw_text(c, tx, sy + step_h - 5 * mm, name, "Helvetica-Bold", 11.5, accent)
        draw_text(c, tx, sy + step_h - 12 * mm, desc, "Helvetica", 8.5, GRAY_600)

        cursor_y = sy - step_gap

    cursor_y -= 3 * mm

    # ─────────────────────────────────────────────────────
    # 3. FOUR-SECTION 2x2 GRID
    # ─────────────────────────────────────────────────────
    grid_gap = 3.5 * mm
    row_gap = 3.5 * mm
    box_w = (CONTENT_W - grid_gap) / 2
    box_h = 54 * mm

    # ── Row 1 ────────────────────────────────────────────
    row1_top = cursor_y

    # ── Box 1: BEFORE I START ────────────────────────────
    b1_x = MARGIN
    b1_y = row1_top - box_h
    draw_rounded_rect(c, b1_x, b1_y, box_w, box_h, 3 * mm,
                      fill_color=PURPLE_LIGHT, stroke_color=PURPLE_MID, stroke_width=0.75)

    # Section header with icon
    draw_text(c, b1_x + 4 * mm, b1_y + box_h - 6 * mm,
              "\u2611  Before I Start", "Helvetica-Bold", 10, PURPLE_DARK)

    draw_checklist(c, b1_x + 3 * mm, b1_y + box_h - 14 * mm, box_w - 6 * mm,
        [
            "I\u2019ve taken three slow breaths",
            "I\u2019ve read the question all the way through",
            "I know what the question is asking me to do",
            "I\u2019ve crossed out at least one wrong answer",
            "I\u2019ve checked my answer matches the question",
        ],
        PURPLE_MID)

    # ── Box 2: HOMEWORK REMINDERS ────────────────────────
    b2_x = MARGIN + box_w + grid_gap
    b2_y = row1_top - box_h
    draw_rounded_rect(c, b2_x, b2_y, box_w, box_h, 3 * mm,
                      fill_color=ORANGE_LIGHT, stroke_color=HexColor("#fed7aa"), stroke_width=0.75)

    draw_text(c, b2_x + 4 * mm, b2_y + box_h - 6 * mm,
              "\u270F  Homework Reminders", "Helvetica-Bold", 10, HexColor("#c2410c"))

    draw_bullet_list(c, b2_x + 3 * mm, b2_y + box_h - 14 * mm, box_w - 6 * mm,
        [
            "Don\u2019t rush \u2014 speed comes from thinking clearly, not panicking",
            "Underline or highlight the key words in every question",
            "If you\u2019re stuck, re-read the question \u2014 the answer is usually hiding in the words",
            "Cover the answers first. What do YOU think the answer is?",
            "Check your work before moving on \u2014 even if you feel sure",
        ],
        ORANGE)

    cursor_y = b1_y - row_gap

    # ── Row 2 ────────────────────────────────────────────
    row2_top = cursor_y

    # ── Box 3: MANAGING YOUR TIME ────────────────────────
    b3_x = MARGIN
    b3_y = row2_top - box_h
    draw_rounded_rect(c, b3_x, b3_y, box_w, box_h, 3 * mm,
                      fill_color=TEAL_LIGHT, stroke_color=TEAL_MID, stroke_width=0.75)

    draw_text(c, b3_x + 4 * mm, b3_y + box_h - 6 * mm,
              "\u23F1  Managing Your Time", "Helvetica-Bold", 10, HexColor("#0f766e"))

    draw_bullet_list(c, b3_x + 3 * mm, b3_y + box_h - 14 * mm, box_w - 6 * mm,
        [
            "Go through the whole paper first, answering everything you can",
            "Put a small dot next to any question you\u2019re unsure about and come back to it",
            "Don\u2019t spend too long on one question, especially on your first run through \u2014 note your best guess and move on",
            "Answer every question \u2014 don\u2019t leave anything blank. Eliminate wrong answers and make your best guess",
            "Keep an eye on the clock \u2014 try to leave 5 minutes at the end to check",
        ],
        TEAL, bullet_style="arrow")

    # ── Box 4: TEST DAY & EXAM ROOM ─────────────────────
    b4_x = MARGIN + box_w + grid_gap
    b4_y = row2_top - box_h
    draw_rounded_rect(c, b4_x, b4_y, box_w, box_h, 3 * mm,
                      fill_color=PINK_LIGHT, stroke_color=HexColor("#fbcfe8"), stroke_width=0.75)

    draw_text(c, b4_x + 4 * mm, b4_y + box_h - 6 * mm,
              "\u2B50  Test Day & Exam Room", "Helvetica-Bold", 10, HexColor("#be185d"))

    draw_bullet_list(c, b4_x + 3 * mm, b4_y + box_h - 14 * mm, box_w - 6 * mm,
        [
            "Before the exam starts, take 3 deep breaths and picture yourself doing well",
            "Read every question twice before you choose an answer",
            "If a question is hard, skip it and come back \u2014 don\u2019t waste time panicking",
            "Pencil? Rub out mistakes cleanly. Pen? Cross out with one neat line \u2014 no scribbling",
            "When you finish, go back and check \u2014 don\u2019t just sit there!",
        ],
        PINK, bullet_style="star")

    cursor_y = b3_y - 3.5 * mm

    # ─────────────────────────────────────────────────────
    # 4. PROFESSOR HOOT QUOTE
    # ─────────────────────────────────────────────────────
    quote_h = 20 * mm
    quote_y = cursor_y - quote_h

    draw_rounded_rect(c, MARGIN, quote_y, CONTENT_W, quote_h, 3 * mm,
                      fill_color=HexColor("#faf5ff"))
    draw_rounded_rect(c, MARGIN, quote_y, CONTENT_W, quote_h, 3 * mm,
                      stroke_color=PURPLE_MID, stroke_width=0.5)

    quote_text = ('\u201cRemember: the owl who reads carefully always finds the answer. '
                  'You\u2019ve trained for this. Trust your CLEAR Method \u2014 and trust yourself.\u201d')

    draw_text(c, MARGIN + 5 * mm, quote_y + quote_h - 6 * mm,
              "Professor Hoot says\u2026", "Helvetica-Bold", 9.5, PURPLE)

    draw_paragraph(c, MARGIN + 5 * mm, quote_y + quote_h - 8 * mm, CONTENT_W - 10 * mm,
                   quote_text, "Helvetica-Oblique", 8.5, GRAY_600, leading=11.5)

    # ─────────────────────────────────────────────────────
    # 5. FOOTER
    # ─────────────────────────────────────────────────────
    footer_y = MARGIN

    draw_gradient_rect(c, MARGIN, footer_y + 9 * mm, CONTENT_W, 0.5 * mm, PURPLE, PINK)

    draw_text_centered(c, WIDTH / 2, footer_y + 4.5 * mm,
                       "AnswerTheQuestion!  \u2022  answerthequestion.co.uk",
                       "Helvetica-Bold", 8, PURPLE)
    draw_text_centered(c, WIDTH / 2, footer_y + 0.5 * mm,
                       "\u00a9 2026 AnswerTheQuestion! \u2014 Built to help kids stop losing marks on questions they can answer.",
                       "Helvetica", 7, GRAY_400)

    # ── Save ─────────────────────────────────────────────
    c.save()
    print(f"PDF created: {output_path}")
    return output_path


if __name__ == "__main__":
    create_crib_sheet()
