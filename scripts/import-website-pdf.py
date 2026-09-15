"""One-time import of clinician-supplied treatment copy into versioned Pages overrides.

The source PDF is deliberately not copied into the public repository. Run locally with
the supplied PDF path; generated editorial-overrides.json is safe to commit.
"""

import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'pages-content' / 'editorial-overrides.json'

# PDF page number, heading marker, stable CMS id, category and public title.
SPECS = [
    (6, '1. MASTOPLASTICA ADDITIV', 'mastoplastica-additiva', 'seno', 'Mastoplastica Additiva'),
    (8, 'GINECOMASTIA', 'trattamento-1783009642344-543', 'seno', 'Ginecomastia'),
    (10, 'LIPOFILLING DEL SENO', 'trattamento-1783008796134-212', 'seno', 'Lipofilling del seno'),
    (12, 'SOSTITUZIONE DELLE PROTESI MAMMARIE', 'trattamento-1783008189754-929', 'seno', 'Sostituzione protesi mammarie'),
    (14, 'MASTOPESSI', 'mastopessi', 'seno', 'Mastopessi'),
    (15, 'MASTOPESSI CON PROTESI', 'mastopessi-con-protesi', 'seno', 'Mastopessi con protesi'),
    (17, 'MASTOPLASTICA RIDUTTIV', 'mastoplastica-riduttiva', 'seno', 'Mastoplastica riduttiva'),
    (19, 'CHIRURGIA MAMMARIA DI REVISIONE', 'mastoplastica-secondaria', 'seno', 'Chirurgia mammaria di revisione'),
    (21, 'RINOPLASTICA', 'rinoplastica', 'viso', 'Rinoplastica'),
    (23, 'BLEFAROPLASTICA', 'blefaroplastica', 'viso', 'Blefaroplastica'),
    (25, 'LIFTING DEL VOLTO', 'lifting-viso', 'viso', 'Lifting del volto'),
    (27, 'LIFTING DEL COLLO', 'lifting-collo', 'viso', 'Lifting del collo'),
    (29, 'LIP LIFT', 'lip-lift', 'viso', 'Lip Lift'),
    (30, 'OTOPLASTICA', 'otoplastica', 'viso', 'Otoplastica'),
    (32, '1. LIPOSUZIONE E LIPOSCULTURA', 'trattamento-1783081296340-906', 'corpo', 'Liposuzione e liposcultura'),
    (33, '2. ADDOMINOPLASTICA', 'addominoplastica', 'corpo', 'Addominoplastica'),
    (35, '3. MINI-ADDOMINOPLASTICA', 'mini-addominoplastica', 'corpo', 'Mini-addominoplastica'),
    (36, '4. LIFTING DELLE BRACCIA', 'lifting-braccia', 'corpo', 'Lifting delle braccia'),
    (38, '5. LIFTING DELLE COSCE', 'lifting-interno-coscia', 'corpo', 'Lifting delle cosce'),
    (39, '6. LIPOFILLING CORPOREO', 'trattamento-1783011434374-475', 'corpo', 'Lipofilling corporeo'),
    (41, '1. BIOSTIMOLAZIONE', 'biorivitalizzazione', 'categoria-1783083169412', 'Biostimolazione'),
    (43, '2. POLINUCLEOTIDI', 'polinucleotidi', 'categoria-1783083169412', 'Polinucleotidi'),
    (44, '3. PRP VISO', 'trattamento-1783086206750-524', 'categoria-1783083169412', 'PRP viso'),
    (45, '4. PRP CAPELLI', 'trattamento-1783086317720-834', 'categoria-1783083169412', 'PRP capelli'),
    (47, '5. MICRONEEDLING', 'trattamento-1783086456336-618', 'categoria-1783083169412', 'Microneedling'),
    (48, '6. ESOSOMI', 'trattamento-1783086546806-827', 'categoria-1783083169412', 'Esosomi'),
    (50, '7. PEELING CHIMICI', 'peeling-chimico', 'categoria-1783083169412', 'Peeling chimici'),
    (51, '1. FILLER VISO', 'filler-acido-ialuronico', 'categoria-1783083537398', 'Filler viso'),
    (53, '2. FILLER LABBRA', 'trattamento-1783084897328-72', 'categoria-1783083537398', 'Filler labbra'),
    (55, '3. RINOFILLER', 'trattamento-1783084049721-941', 'categoria-1783083537398', 'Rinofiller'),
    (56, '4. FULL FACE', 'trattamento-1783083486532-131', 'categoria-1783083537398', 'Full Face'),
    (58, '5. TOSSINA BOTULINICA', 'tossina-botulinica', 'categoria-1783083537398', 'Tossina botulinica'),
    (59, '6. IDROSSIAPATITE DI CALCIO', 'idrossiapatite-di-calcio', 'categoria-1783083537398', 'Idrossiapatite di calcio'),
    (61, '7. ACIDO POLILATTICO', 'trattamento-1783085114277-889', 'categoria-1783083537398', 'Acido polilattico'),
    (63, '8. GLUTEOFILLER', 'trattamento-1783084424784-899', 'categoria-1783083537398', 'Gluteofiller'),
    (64, '9. FOAMING TECHNIQUE', 'foaming-technique', 'categoria-1783083537398', 'Foaming Technique'),
    (66, '1. LASER CO₂ FRAZIONATO', 'trattamento-1783086986373-602', 'categoria-1783086908067', 'Laser CO₂ frazionato'),
    (68, '2. LASER CO₂ ABLATIVO', 'trattamento-1783087137569-95', 'categoria-1783086908067', 'Laser CO₂ ablativo'),
    (69, '3. SUBLIFTING', 'sublifting-laser-diodo', 'categoria-1783086908067', 'SubLifting laser diodo'),
    (71, '4. CARBOSSITERAPIA', 'trattamento-1783085316839-156', 'categoria-1783086908067', 'Carbossiterapia'),
    (72, '5. VECTRA 3D', 'vectra-3d', 'categoria-1783086908067', 'Vectra 3D'),
]

def normalize(text):
    text = text.replace('\u00ad', '').replace('\xa0', ' ')
    for wrong, right in {
        'V olume': 'Volume', 'A seconda': 'A seconda', 'I polinucleotidi': 'I polinucleotidi',
        'A VVIENE': 'AVVIENE', 'V ALUT': 'VALUT', 'RINNOV AMENTO': 'RINNOVAMENTO',
        'SOLLEV AMENTO': 'SOLLEVAMENTO', 'PRESERV ATIV A': 'PRESERVATIVA',
        'PROGRESSIV A': 'PROGRESSIVA', 'RIDUTTIV A': 'RIDUTTIVA',
        'INDICATIV A': 'INDICATIVA',
    }.items():
        text = text.replace(wrong, right)
    text = re.sub(r'(?<=\w)\s+(?=[,.!?;:])', '', text)
    return text

def is_heading(line):
    line = re.sub(r'^\d+\.\s*', '', line).strip()
    return 8 <= len(line) <= 125 and len(re.findall(r'[A-ZÀ-Ü]', line)) >= 5 and not re.search(r'[a-zà-ü]', line)

def clean_line(line):
    line = normalize(line.strip())
    if not line or re.search(r'(?i)^(?:descrizione generale|nota importante:|ag[g]?iungere|eliminare|sostituire|metterei|valuta|box piccolo|benefici metterei|prenota una visita)', line):
        return ''
    return line

def parse_block(block, marker):
    lines = [clean_line(line) for line in block.splitlines()]
    lines = [line for line in lines if line]
    if not lines:
        return '', []
    marker_index = next((i for i, line in enumerate(lines) if marker.casefold() in line.casefold()), 0)
    lines = lines[marker_index + 1:]
    # Remove trailing design notes and infobox/benefit instructions; those are applied separately.
    stop = next((i for i, line in enumerate(lines) if re.search(r'(?i)^(?:(?:\d+\.?\s*)?(?:box piccolo|benefici|ripresa delle attivit[aà]|cta\b|nota generale|ag[g]?iungere nei box)|anestesia$|recupero$)', line)), len(lines))
    lines = lines[:stop]
    if lines and is_heading(lines[0]) and not lines[0].endswith('?'):
        subtitle_parts = [lines.pop(0)]
        while lines and is_heading(lines[0]) and not lines[0].endswith('?') and not re.match(r'^\d+\.', lines[0]):
            subtitle_parts.append(lines.pop(0))
        subtitle = ' '.join(subtitle_parts)
    else:
        subtitle = ''
    sections = []
    current = {'heading': '', 'body': []}
    for line in lines:
        if is_heading(line) and (line.endswith('?') or line.startswith(tuple(f'{i}.' for i in range(1, 10))) or len(line.split()) <= 9):
            if current['body']:
                sections.append(current)
            current = {'heading': re.sub(r'^\d+\.\s*', '', line).strip(), 'body': []}
        else:
            current['body'].append(line)
    if current['body']:
        sections.append(current)
    for section in sections:
        section['body'] = ' '.join(section['body']).replace('  ', ' ')
        section['body'] = re.sub(r'\bANESTESIA\s+Generale\s+DURATA\s+INDICATIV\s*A\s+2[–-]3\s+ore\s+DEGENZA\s+Day Hospital o 1 notte\s*', '', section['body'])
    sections = [section for section in sections if not re.search(r'(?i)^(?:quality|attivit[aà]$|ripresa delle$|\d+ benefici|anestesia$|recupero$)', section['heading'])]
    intro = sections.pop(0) if sections and not sections[0]['heading'] else {'body': ''}
    if not intro['body'] and sections and sections[0]['heading'] and not sections[0]['heading'].endswith('?'):
        intro = sections.pop(0)
        subtitle = f'{subtitle} {intro["heading"]}'.strip()
    intro['body'] = re.sub(r'^Sì: la inserirei[^.]*\.\s*', '', intro['body'])
    intro['body'] = re.sub(r'^(?:Aumento del Volume del Seno|VOLTO)\s+', '', intro['body'])
    return subtitle, intro['body'], sections

def extract_box(block):
    labels = {
        'ANESTESIA': 'anesthesia',
        'DURATA': 'duration',
        'DURATA INDICATIVA': 'duration',
        'DEGENZA': 'hospitalization',
        'RECUPERO': 'recoveryTime',
        'RIPRESA DELLE ATTIVITÀ': 'recoveryTime',
        'RIPRESA DELLE ATTIVITÀ SOCIALI': 'recoveryTime',
    }
    lines = [normalize(line.strip()) for line in block.splitlines() if line.strip()]
    result = {}
    for index, line in enumerate(lines[:-1]):
        key = labels.get(line.upper())
        if key and key not in result:
            value = lines[index + 1]
            if value.upper() not in labels and not value.upper().startswith('BOX'):
                result[key] = value
    return result

def main(pdf_path):
    reader = PdfReader(pdf_path)
    pages = [page.extract_text() or '' for page in reader.pages]
    existing = json.loads(OUTPUT.read_text(encoding='utf-8')) if OUTPUT.exists() else {}
    current = json.loads((ROOT / 'pages-content' / 'site-content.json').read_text(encoding='utf-8'))
    existing_by_id = {item['id']: item for item in current['treatments']}
    treatments = []
    for index, (page_no, marker, cms_id, category, title) in enumerate(SPECS):
        page_text = pages[page_no - 1]
        start = page_text.casefold().find(marker.casefold())
        if start < 0:
            print(f'WARNING: heading not found on page {page_no}: {marker}', file=sys.stderr)
            continue
        next_page = SPECS[index + 1][0] if index + 1 < len(SPECS) else 74
        chunks = [page_text[start:]] + pages[page_no:next_page]
        block = '\n'.join(chunks)
        if index + 1 < len(SPECS):
            next_marker = SPECS[index + 1][1]
            match = re.search(rf'(?m)^\s*{re.escape(next_marker)}', block, re.IGNORECASE)
            if match:
                block = block[:match.start()]
        subtitle, intro, sections = parse_block(block, marker)
        if title == 'Vectra 3D':
            for section in sections:
                if section['heading'] == 'RISULTATO?':
                    section['heading'] = 'La simulazione garantisce il risultato?'
        if title == 'Filler labbra':
            for section in sections:
                if section['heading'].startswith('QUALI ASPETTI VENGONO'):
                    section['heading'] = 'Quali aspetti vengono valutati durante la visita?'
                    section['body'] = re.sub(r'^VISITA\?\s*', '', section['body'])
        if title == 'SubLifting laser diodo':
            subtitle = 'Rimodellamento sottocutaneo e skin tightening'
        if title == 'Filler viso':
            subtitle = 'Ripristino selettivo dei volumi e delle proporzioni del volto'
        if not intro:
            print(f'WARNING: missing intro: {title}', file=sys.stderr)
        source = existing_by_id.get(cms_id, {})
        summary = intro[:400]
        if len(intro) > 400:
            sentence_end = summary.rfind('. ')
            summary = summary[:sentence_end + 1] if sentence_end > 150 else summary[:summary.rfind(' ')] + '…'
        item = {
            'id': cms_id,
            'category': category,
            'title': title,
            'subtitle': subtitle.title() if subtitle else source.get('subtitle', title),
            'description': summary if intro else source.get('description', ''),
            'fullDescription': intro,
            'detailSections': sections,
        }
        if category in ('seno', 'viso', 'corpo'):
            item['benefits'] = [normalize(line.strip().lstrip('•').strip()) for line in block.splitlines() if line.strip().startswith('•')][:4]
            item.update(extract_box(block))
        else:
            item['benefits'] = []
        if not source:
            item.update(anesthesia='Da definire durante la visita', duration='Da definire durante la visita', hospitalization='Da definire durante la visita', recoveryTime='Da definire durante la visita', benefits=[], imageUrl='')
        if cms_id == 'vectra-3d':
            item['isTechnology'] = True
        if category in ('seno', 'viso', 'corpo') and 'recoveryTime' not in item:
            item['recoveryTime'] = source.get('recoveryTime', 'Da definire durante la visita')
        treatments.append(item)
    # The PDF explicitly withholds commercial publication of the exosome page pending product verification.
    treatments = [item for item in treatments if item['title'] != 'Esosomi']
    treatments.append({'id': 'trattamento-1783086546806-827', 'hidden': True})
    existing['treatments'] = treatments
    OUTPUT.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Imported {len(treatments) - 1} treatment pages; review {OUTPUT}.')

if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python scripts/import-website-pdf.py "Sito web (1).pdf"')
    main(sys.argv[1])
