#!/usr/bin/env python3
"""Generate the CLEAR Method Crib Sheet PDF for AnswerTheQuestion!"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, Color
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

import os

OUTPUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "clear-method-crib-sheet.pdf")

# Brand colours
PURPLE = HexColor("#7c3aed")
PURPLE_DARK = HexColor("#5b21b6")
PURPLE_LIGHT = HexColor("#ede9fe")
FUCHSIA = HexColor("#d946ef")
GOLD = HexColor("#f59e0b")
GOLD_LIGHT = HexColor("#fef3c7")
BLUE = HexColor("#3b82f6")
ORANGE = HexColor("#f97316")
GREEN = HexColor("#22c55e")
GREEN_DARK = HexColor("#16a34a")
DARK_TEXT = HexColor("#1f2937")
GRAY_TEXT = HexColor("#6b7280")
LIGHT_GRAY = HexColor("#f3f4f6")

# Card background colours (light tints)
PURPLE_TINT = HexColor("#f5f0ff")
BLUE_TINT = HexColor("#eff6ff")
ORANGE_TINT = HexColor("#fff7ed")
FUCHSIA_TINT = HexColor("#fdf4ff")
GREEN_TINT = HexColor("#f0fdf4")

# Card accent/border colours
PURPLE_ACCENT = HexColor("#c4b5fd")
BLUE_ACCENT = HexColor("#93c5fd")
ORANGE_ACCENT = HexColor("#fdba74")
FUCHSIA_ACCENT = HexColor("#f0abfc")
GREEN_ACCENT = HexColor("#86efac")

WIDTH, HEIGHT = A4  # 595.27 x 841.89 points


def draw_rounded_rect(c, x, y, w, h, radius, fill_color=None, stroke_color=None, stroke_width=1):
    """Draw a rounded rectangle."""
    c.saveState()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)

    p = c.beginPath()
    p.moveTo(x + radius, y)
    p.lineTo(x + w - radius, y)
    p.arcTo(x + w - radius, y, x + w, y + radius, radius)
    p.lineTo(x + w, y + h - radius)
    p.arcTo(x + w, y + h - radius, x + w - radius, y + h, radius)
    p.lineTo(x + radius, y + h)
    p.arcTo(x + radius, y + h, x, y + h - radius, radius)
    p.lineTo(x, y + radius)
    p.arcTo(x, y + radius, x + radius, y, radius)
    p.close()

    if fill_color and stroke_color:
        c.drawPath(p, fill=1, stroke=1)
    elif fill_color:
        c.drawPath(p, fill=1, stroke=0)
    else:
        c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def draw_circle_letter(c, cx, cy, radius, letter, bg_color, text_color=white):
    """Draw a large letter inside a filled circle."""
    c.saveState()
    c.setFillColor(bg_color)
    c.circle(cx, cy, radius, fill=1, stroke=0)
    c.setFillColor(text_color)
    c.setFont("Helvetica-Bold", radius * 1.3)
    c.drawCentredString(cx, cy - radius * 0.42, letter)
    c.restoreState()


def draw_header(c):
    """Draw the top header section."""
    # Purple header background
    header_h = 95
    draw_rounded_rect(c, 20, HEIGHT - 20 - header_h, WIDTH - 40, header_h, 12,
                      fill_color=PURPLE)

    # Gold accent bar at top
    draw_rounded_rect(c, 20, HEIGHT - 20 - 6, WIDTH - 40, 6, 3, fill_color=GOLD)

    # Title text
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(WIDTH / 2, HEIGHT - 60, "The CLEAR Method")

    # Owl emoji placeholder on left
    c.setFont("Helvetica", 32)
    c.drawString(38, HEIGHT - 65, "\xF0\x9F\xA6\x89")  # We'll use text instead

    # Branding
    c.setFont("Helvetica", 13)
    c.setFillColor(GOLD_LIGHT)
    c.drawCentredString(WIDTH / 2, HEIGHT - 82, "AnswerTheQuestion!  --  Your 5-Step Exam Superpower")

    # Decorative stars
    c.setFillColor(HexColor("#fde68a"))
    c.setFont("Helvetica", 14)
    c.drawString(40, HEIGHT - 85, "*")
    c.drawString(WIDTH - 55, HEIGHT - 55, "*")
    c.drawString(WIDTH - 48, HEIGHT - 85, "*")
    c.drawString(48, HEIGHT - 50, "*")


def draw_step_card(c, x, y, w, h, letter, title, emoji_text, bullets,
                   bg_color, accent_color, letter_color, step_num):
    """Draw a single CLEAR method step card."""
    # Card background
    draw_rounded_rect(c, x, y, w, h, 10, fill_color=bg_color,
                      stroke_color=accent_color, stroke_width=1.5)

    # Left accent stripe
    c.saveState()
    c.setFillColor(letter_color)
    # Clip to rounded rect area
    p = c.beginPath()
    p.moveTo(x, y + 10)
    p.lineTo(x, y + h - 10)
    p.arcTo(x, y + h - 10, x + 10, y + h, 10)
    p.lineTo(x + 6, y + h)
    p.lineTo(x + 6, y)
    p.lineTo(x + 10, y)
    p.arcTo(x + 10, y, x, y + 10, 10)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.restoreState()

    # Circle with letter
    circle_x = x + 38
    circle_y = y + h / 2
    draw_circle_letter(c, circle_x, circle_y, 18, letter, letter_color)

    # Step title
    content_x = x + 66
    c.setFillColor(DARK_TEXT)
    c.setFont("Helvetica-Bold", 15)
    title_y = y + h - 22
    c.drawString(content_x, title_y, f"{emoji_text}  {title}")

    # Bullet points
    c.setFont("Helvetica", 10.5)
    c.setFillColor(HexColor("#374151"))
    bullet_y = title_y - 19
    for bullet in bullets:
        c.setFillColor(letter_color)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(content_x + 2, bullet_y, ">")
        c.setFillColor(HexColor("#374151"))
        c.setFont("Helvetica", 10.5)
        c.drawString(content_x + 15, bullet_y, bullet)
        bullet_y -= 15


def draw_footer(c):
    """Draw the bottom footer section."""
    footer_y = 20
    footer_h = 52

    # Footer background
    draw_rounded_rect(c, 20, footer_y, WIDTH - 40, footer_h, 10,
                      fill_color=PURPLE_LIGHT)

    # Footer text
    c.setFillColor(PURPLE_DARK)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(WIDTH / 2, footer_y + 32,
                        "Print me out! Stick me on the fridge, the desk, or inside a homework folder.")

    c.setFillColor(GRAY_TEXT)
    c.setFont("Helvetica", 10)
    c.drawCentredString(WIDTH / 2, footer_y + 14,
                        "answerthequestion.co.uk")


def draw_decorative_elements(c):
    """Add subtle decorative elements."""
    # Small gold stars scattered
    c.saveState()
    c.setFillColor(HexColor("#fcd34d"))

    positions = [
        (35, HEIGHT - 140), (WIDTH - 45, HEIGHT - 160),
        (30, 95), (WIDTH - 40, 90),
    ]

    for px, py in positions:
        c.setFont("Helvetica", 10)
        c.drawCentredString(px, py, "+")

    c.restoreState()


def main():
    c = canvas.Canvas(OUTPUT_PATH, pagesize=A4)
    c.setTitle("CLEAR Method Crib Sheet - AnswerTheQuestion!")
    c.setAuthor("AnswerTheQuestion!")
    c.setSubject("11+ Exam Technique - The CLEAR Method")

    # Page background - very subtle gradient feel with light purple
    c.setFillColor(white)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)

    # Subtle background pattern - light dots
    c.setFillColor(HexColor("#f9f5ff"))
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)

    # Draw header
    draw_header(c)

    # Define the 5 CLEAR steps
    steps = [
        {
            "letter": "C",
            "title": "Calm",
            "emoji": "Calm",
            "bullets": [
                "Take 3 deep breaths before you begin",
                'Tell yourself: "I\'ve practised this. I\'m ready."',
                "Relax your shoulders and sit tall",
            ],
            "bg": PURPLE_TINT,
            "accent": PURPLE_ACCENT,
            "color": PURPLE,
        },
        {
            "letter": "L",
            "title": "Look",
            "emoji": "Look",
            "bullets": [
                "Read the WHOLE question carefully - every single word",
                "Underline key words (not, all, except, most likely)",
                'Check: "What is this question actually asking me?"',
            ],
            "bg": BLUE_TINT,
            "accent": BLUE_ACCENT,
            "color": BLUE,
        },
        {
            "letter": "E",
            "title": "Eliminate",
            "emoji": "Eliminate",
            "bullets": [
                "Cross out answers you KNOW are wrong",
                "Fewer choices = better chances",
                "Even eliminating one option helps!",
            ],
            "bg": ORANGE_TINT,
            "accent": ORANGE_ACCENT,
            "color": ORANGE,
        },
        {
            "letter": "A",
            "title": "Answer",
            "emoji": "Answer",
            "bullets": [
                "Choose the BEST answer from what's left",
                "Trust your first instinct - it's usually right",
                "Don't leave any question blank - always have a go!",
            ],
            "bg": FUCHSIA_TINT,
            "accent": FUCHSIA_ACCENT,
            "color": FUCHSIA,
        },
        {
            "letter": "R",
            "title": "Review",
            "emoji": "Review",
            "bullets": [
                "If time allows, check your answer makes sense",
                "Re-read the question one more time",
                "Move on confidently to the next question",
            ],
            "bg": GREEN_TINT,
            "accent": GREEN_ACCENT,
            "color": GREEN_DARK,
        },
    ]

    # Layout cards
    card_margin_x = 28
    card_w = WIDTH - 2 * card_margin_x
    card_h = 92
    card_gap = 10

    # Start below header
    start_y = HEIGHT - 130

    for i, step in enumerate(steps):
        card_y = start_y - (i + 1) * (card_h + card_gap) + card_gap
        draw_step_card(
            c, card_margin_x, card_y, card_w, card_h,
            step["letter"], step["title"], step["emoji"],
            step["bullets"],
            step["bg"], step["accent"], step["color"],
            i + 1
        )

    # Draw decorative elements
    draw_decorative_elements(c)

    # Draw footer
    draw_footer(c)

    # Save
    c.save()
    print(f"PDF saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
