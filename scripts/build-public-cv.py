"""Create the public, professional-only CV from the clinician's updated ENG CV.

The supplied PDF contains a home address, birth date and private email. Those fields
are intentionally excluded from this downloadable website version.
"""

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output' / 'pdf' / 'CV-Vincenzo-Mazzarella-professionale.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

navy = colors.HexColor('#101428')
teal = colors.HexColor('#3F9E9A')
muted = colors.HexColor('#4D5865')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='CvTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=22, leading=25, textColor=navy, alignment=TA_CENTER, spaceAfter=7))
styles.add(ParagraphStyle(name='CvSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=muted, alignment=TA_CENTER, spaceAfter=13))
styles.add(ParagraphStyle(name='CvHeading', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=navy, spaceBefore=13, spaceAfter=6))
styles.add(ParagraphStyle(name='CvEntry', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12.5, textColor=navy, spaceAfter=6))
styles.add(ParagraphStyle(name='CvNote', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=muted, spaceBefore=11))

def heading(text):
    return Paragraph(text, styles['CvHeading'])

def entry(date, text):
    return Paragraph(f'<font color="#3F9E9A"><b>{date}</b></font> &nbsp; {text}', styles['CvEntry'])

def page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(teal)
    canvas.setLineWidth(0.6)
    canvas.line(18 * mm, height - 18 * mm, width - 18 * mm, height - 18 * mm)
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(muted)
    canvas.drawString(18 * mm, 14 * mm, 'Dr. Vincenzo Mazzarella - Professional CV')
    canvas.drawRightString(width - 18 * mm, 14 * mm, str(doc.page))
    canvas.restoreState()

story = [
    Spacer(1, 9 * mm),
    Paragraph('DR. VINCENZO MAZZARELLA', styles['CvTitle']),
    Paragraph('Plastic, Reconstructive and Aesthetic Surgeon<br/>+39 350 096 1963 | info@drvincenzomazzarella.it<br/>Medical registration: Naples Order of Physicians, Surgeons and Dentists, No. 36297', styles['CvSubtitle']),
    heading('Current professional positions'),
    entry('Nov 2024 - present', 'Clinical practice in Frattamaggiore, Naples and Milan; Clinica Sanatrix, Naples.'),
    entry('Jan 2025 - present', 'Medical referee, Medixa S.r.l., San Sebastiano al Vesuvio, Naples.'),
    heading('Education and qualifications'),
    entry('Jun 2026', 'Second-Level University Master\'s Degree in Functional, Aesthetic and Reconstructive Surgery of the Nasal Pyramid, Universita Cattolica del Sacro Cuore, Faculty of Medicine and Surgery A. Gemelli, Rome.'),
    entry('Nov 2019 - Nov 2024', 'Residency in Plastic, Reconstructive and Aesthetic Surgery, University of Campania Luigi Vanvitelli, Naples.'),
    entry('Feb 2019', 'Qualified as a medical doctor and registered with the Naples Medical Order, No. 36297.'),
    entry('Jul 2018', 'MD Degree in Medicine and Surgery, University of Naples Federico II, 110/110 cum laude.'),
    entry('Sep 2016 - Jun 2017', 'Erasmus+ Programme, Charles University, Faculty of Medicine in Pilsen, Czech Republic.'),
    heading('Scientific society memberships'),
    Paragraph('AICPE - Italian Association of Aesthetic Plastic Surgery<br/>AICEFF - Italian Association of Aesthetic and Functional Surgery of the Face<br/>EAFPS - European Academy of Facial Plastic Surgery', styles['CvEntry']),
    heading('International clinical training and advanced courses'),
]

training = [
    ('Jan 2026', 'Dissection course for aesthetic surgery of the face, SICPRE, ICLO Teaching and Research Center, Verona.'),
    ('Sep 2025', 'Beyond the Face live surgery course, AICPE, Naples.'),
    ('Jan 2025', 'MFI Academy, Milano Face Intense Course and Face and Neck Procedure Dissection Course, Milan.'),
    ('Nov 2024', 'Multicenter rhinoseptoplasty techniques course, Atripalda.'),
    ('Nov 2024', 'Surgical Rhinoplasty vs Medical Rhinoplasty, live surgery course, AICPE, Naples.'),
    ('Sep 2024', 'Bottis\' Best Face, Gardone Riviera.'),
    ('May 2024', 'Observership, My Face Clinic, Lisbon, directed by Dr. Jose Carlos Neves.'),
    ('Mar 2024', 'International congress on plastic surgery of the eyelid region, Milan.'),
    ('Dec 2023', 'Rhinoplasty observership with Dr. Enrico Robotti, Bergamo.'),
    ('Nov 2023', 'Multicenter rhinoseptoplasty techniques course, Atripalda.'),
    ('Oct 2023', 'Third International Rhinoplasty Congress, Rome.'),
    ('Oct - Dec 2023', 'Clinical rotation, Plastic and Reconstructive Surgery, Ospedale del Mare, Naples.'),
    ('Oct 2023', 'MyFace Academy 23, Lisbon.'),
    ('Apr 2023', 'Anatomic dissection and facial aesthetic surgery techniques, Trecchi Human Lab, Cremona.'),
    ('Oct 2022 - Mar 2023', 'Clinical rotation, Plastic and Reconstructive Surgery, Tirol Kliniken, Innsbruck.'),
    ('Dec 2023', 'Breast Reconstruction Technique course, ICLO, Verona.'),
    ('Apr 2022', 'Basic Microsurgery course, A.O.R.N. Cardarelli, Naples.'),
    ('Jan 2022', 'Perforating flaps training, Sophia Antipolis University of Medicine, Nice.'),
    ('Nov 2021 - May 2022', 'Clinical rotation, Plastic and Reconstructive Surgery, Ospedali Riuniti, Foggia.'),
    ('Sep - Nov 2020', 'Clinical rotation, General Surgery, University of Campania Luigi Vanvitelli, Naples.'),
]
story += [entry(date, text) for date, text in training]
story += [heading('Academic, teaching and international faculty activity')]

teaching = [
    ('Jun 2026', 'International speaker/faculty activities in Bangkok, Hanoi and Ho Chi Minh City on full-face treatments.'),
    ('May 2026', 'International full-face workshop, Prague.'),
    ('May 2026', 'Lecturer on lip filler techniques, International Second-Level University Master\'s Degree in Global Aesthetic Medicine, Naples.'),
    ('Apr 2026', 'International workshop in aesthetic medicine, Athens.'),
    ('Mar 2026', 'Teacher, Full Face Course in Aesthetic Medicine, Naples.'),
    ('Dec 2025', 'International Faculty, i-SWAM 2025, Jakarta.'),
    ('Oct 2025', 'International Faculty, Aesthetics and Anti Aging World Congress, Islamabad.'),
    ('May 2025', 'Speaker, 46th SIME Congress, Rome.'),
    ('Apr 2025', 'Lecturer, Second-Level University Master\'s Degree in Advanced Aesthetic Medicine, Federico II University, Naples.'),
    ('Apr 2025', 'International speaker, Advanced Aesthetic Face, Tashkent.'),
    ('Mar 2025', 'Lecturer, Second-Level University Master\'s Degree in Advanced Aesthetic Medicine, Federico II University, Naples.'),
    ('Oct 2024', 'Speaker, 72nd SICPRE Congress, on non-melanoma skin cancer surgery of the face.'),
    ('Jan - Feb 2024', 'Speaker, 32nd SICPRE Winter Congress, on columella reconstruction.'),
    ('Sep 2023', 'Speaker, 71st SICPRE Congress, on breast contouring in reduction mammaplasty.'),
    ('Apr - May 2022', 'Teacher and tutor, Basic Course of Sutures, University of Foggia.'),
]
story += [entry(date, text) for date, text in teaching]
story += [heading('Scientific publications')]

publications = [
    ('2024', 'Reconstruction of the columella with interposition of nasogenian flaps: A case report. International Journal of Surgery Case Reports. DOI: 10.1016/j.ijscr.2024.109238'),
    ('2024', 'Borderline Case in Reconstructive Plastic Surgery of the Lower Limb Treated with Bone Drilling and Use of Dermal Regeneration Template. Plastic &amp; Reconstructive Surgery - Global Open. DOI: 10.1097/GOX.0000000000005694'),
    ('2024', 'Training in Vascular Microsurgery: The Ex Vivo Biological Model on Domestic Turkey Leg. Plastic &amp; Reconstructive Surgery - Global Open. DOI: 10.1097/GOX.0000000000005733'),
    ('2024', 'The use of Fibrin Sealants in Reducing Drain Output in Abdominoplasty: Is it Useful? JPRAS Open. DOI: 10.1016/j.jpra.2024.06.001'),
    ('2024', 'Functional and Aesthetic Comparison between Grafts and Local Flaps in Non-Melanoma Skin Cancer Surgery of the Face: A Cohort Study. JPRAS Open.'),
    ('2025', 'Lateral based dermal flap in breast contouring in reduction mammaplasty. International Journal of Surgery Case Reports. DOI: 10.1016/j.ijscr.2025.110876'),
]
story += [entry(date, text) for date, text in publications]
story += [Paragraph('This public CV contains professional information only. The clinician\'s supplied full CV remains the source for detailed course dates and publication authorship.', styles['CvNote'])]

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=19 * mm, rightMargin=19 * mm, topMargin=22 * mm, bottomMargin=21 * mm, title='Professional CV - Dr. Vincenzo Mazzarella', author='Dr. Vincenzo Mazzarella')
doc.build(story, onFirstPage=page, onLaterPages=page)
print(OUTPUT)
