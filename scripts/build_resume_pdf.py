#!/usr/bin/env python3
"""Build the one-page PDF résumé and matching project-archive QR from resume.json."""
import json
from pathlib import Path
from xml.sax.saxutils import escape

import qrcode
import qrcode.image.svg
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.platypus import Flowable, Paragraph, Spacer, Table, TableStyle, HRFlowable, SimpleDocTemplate

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "src/data/resume.json").read_text(encoding="utf-8"))
PUBLIC = ROOT / "public"
PUBLIC.mkdir(exist_ok=True)
QR_URL = DATA["projectsQR"]["url"]

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=6, border=4)
qr.add_data(QR_URL)
qr.make(fit=True)
qr_svg = qrcode.make(QR_URL, image_factory=qrcode.image.svg.SvgPathImage,
                     error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=6, border=4)
(PUBLIC / "project-archive-qr.svg").write_bytes(qr_svg.to_string())

class QRFlowable(Flowable):
    def __init__(self, value, size=20 * mm):
        super().__init__()
        self.size = size
        self.widget = QrCodeWidget(value, barLevel="M")
        x1, y1, x2, y2 = self.widget.getBounds()
        self.qr_size = max(x2 - x1, y2 - y1)
        self.width = self.height = size
    def draw(self):
        self.canv.saveState()
        self.canv.scale(self.size / self.qr_size, self.size / self.qr_size)
        renderPDF.draw(self.widget, self.canv, 0, 0)
        self.canv.restoreState()

navy = colors.HexColor("#10233F")
teal = colors.HexColor("#087E80")
ink = colors.HexColor("#17212F")
muted = colors.HexColor("#526174")
pale = colors.HexColor("#EAF1F6")
line = colors.HexColor("#D7E0E8")
wash = colors.HexColor("#EAF7F5")
styles = getSampleStyleSheet()

def add_style(name, **kwargs):
    styles.add(ParagraphStyle(name="BP" + name, **kwargs))
add_style("Name", fontName="Helvetica-Bold", fontSize=20, leading=22, textColor=navy, spaceAfter=2)
add_style("Headline", fontName="Helvetica", fontSize=8.1, leading=10, textColor=teal, spaceAfter=4)
add_style("Body", fontName="Helvetica", fontSize=7.1, leading=9, textColor=ink, spaceAfter=1.5)
add_style("Small", fontName="Helvetica", fontSize=6.3, leading=7.8, textColor=muted, spaceAfter=1, wordWrap="CJK")
add_style("Section", fontName="Helvetica-Bold", fontSize=8.3, leading=9.7, textColor=teal, spaceBefore=3, spaceAfter=3)
add_style("Side", fontName="Helvetica", fontSize=6.9, leading=8.4, textColor=ink, spaceAfter=2, wordWrap="CJK")
add_style("SideHead", fontName="Helvetica-Bold", fontSize=7.9, leading=9.3, textColor=navy, spaceBefore=5, spaceAfter=2)
add_style("Project", fontName="Helvetica-Bold", fontSize=7.7, leading=9, textColor=navy)
add_style("Role", fontName="Helvetica-Bold", fontSize=7.7, leading=9, textColor=navy)
add_style("Bullet", fontName="Helvetica", fontSize=6.8, leading=8.4, textColor=ink, leftIndent=7, firstLineIndent=-5, spaceAfter=1)
add_style("QR", fontName="Helvetica-Bold", fontSize=7, leading=8.5, textColor=navy)
add_style("Footer", fontName="Helvetica", fontSize=5.9, leading=7, textColor=muted, alignment=TA_CENTER)

def P(value, style="Body"):
    return Paragraph(value, styles["BP" + style])
def section(label):
    return [P(escape(label.upper()), "Section"),
            HRFlowable(width="100%", thickness=.55, color=line, spaceAfter=3)]
def bullet(value):
    return P("• " + escape(value), "Bullet")

left = [P("CONTACT", "SideHead")]
for key, value in DATA.get("contact", []):
    left.append(P(escape(value), "Side"))
left += section("Education")
for degree, institution, timeline in DATA.get("education", []):
    left.append(P(f"<b>{escape(degree)}</b><br/>{escape(institution)}<br/><font color='#526174'>{escape(timeline)}</font>", "Side"))
left += section("Technical toolkit")
for category, skills in DATA.get("skills", []):
    left.append(P(f"<b>{escape(category)}</b><br/>{escape(' · '.join(skills))}", "Side"))
left += section("Certifications")
for item in DATA.get("certifications", []):
    left.append(bullet(item))
for extra in DATA.get("extra", []):
    if "creative" in extra.get("title", "").lower() or "programming" in extra.get("title", "").lower():
        left += section(extra["title"])
        for item in extra.get("items", []):
            left.append(P(f"<b>{escape(item.get('title', ''))}</b><br/>{escape(item.get('meta', ''))}", "Side"))
            for detail in item.get("bullets", []):
                left.append(bullet(detail))

right = [P(escape(DATA["name"] + " " + DATA.get("nameAccent", "")), "Name"),
         P(escape(DATA["title"].upper()), "Headline"),
         P(escape(DATA.get("summary", "")), "Body")]
right += section("Selected engineering projects")
for project in DATA.get("projects", []):
    right.append(P(escape(project["name"]), "Project"))
    right.append(P(escape(project.get("tech", "")), "Small"))
    for url in project.get("links", []):
        safe_url = escape(url, {'"': '&quot;'})
        right.append(P(f'<link href="{safe_url}" color="#087E80">{safe_url}</link>', "Small"))
    for detail in project.get("bullets", []):
        right.append(bullet(detail))
    right.append(Spacer(1, 1))
right += section("Experience & leadership")
for item in DATA.get("experience", []):
    right.append(P(f"{escape(item['role'])} — {escape(item['org'])}", "Role"))
    right.append(P(escape(item.get("place", "")), "Small"))
    for detail in item.get("bullets", []):
        right.append(bullet(detail))
right += section("Additional")
right.append(bullet(DATA.get("footer", "Open to software engineering opportunities")))
right.append(P("Interests: applied AI, product engineering, interactive 3D systems and music technology.", "Small"))

qr_card = Table([[QRFlowable(QR_URL, 19 * mm),
                  [P("PROJECT ARCHIVE", "QR"),
                   P("Scan to explore selected projects, source repositories and available live demos.", "Small"),
                   P(escape(DATA["projectsQR"].get("display", QR_URL)), "Small")]]],
                colWidths=[22 * mm, 94 * mm])
qr_card.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), wash), ("BOX", (0,0), (-1,-1), .5, teal),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("LEFTPADDING", (0,0), (-1,-1), 4),
    ("RIGHTPADDING", (0,0), (-1,-1), 4), ("TOPPADDING", (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3)
]))
right += [Spacer(1, 3), qr_card]

left_col = Table([[left]], colWidths=[56 * mm])
left_col.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), pale), ("LEFTPADDING", (0,0), (-1,-1), 7),
    ("RIGHTPADDING", (0,0), (-1,-1), 7), ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6)
]))
right_col = Table([[right]], colWidths=[126 * mm])
right_col.setStyle(TableStyle([
    ("LEFTPADDING", (0,0), (-1,-1), 8), ("RIGHTPADDING", (0,0), (-1,-1), 7),
    ("TOPPADDING", (0,0), (-1,-1), 6), ("BOTTOMPADDING", (0,0), (-1,-1), 6)
]))
layout = Table([[left_col, right_col]], colWidths=[60 * mm, 132 * mm])
layout.setStyle(TableStyle([
    ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 0),
    ("RIGHTPADDING", (0,0), (-1,-1), 0), ("TOPPADDING", (0,0), (-1,-1), 0),
    ("BOTTOMPADDING", (0,0), (-1,-1), 0)
]))
doc = SimpleDocTemplate(str(PUBLIC / "resume.pdf"), pagesize=A4,
                        leftMargin=8*mm, rightMargin=8*mm, topMargin=6*mm, bottomMargin=6*mm,
                        title=DATA["name"] + " — Resume", author=DATA["name"])
doc.build([layout, Spacer(1, 2), P("BEZALEEL PAUL N  •  APPLIED AI & SOFTWARE ENGINEERING  •  NOVEMBER 2026", "Footer")])
print("Generated public/resume.pdf and public/project-archive-qr.svg")
