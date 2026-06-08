export type LegalDocId = 'terms' | 'privacy' | 'cancellation';

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalDocument {
  id: LegalDocId;
  title: string;
  eyebrow: string;
  updated: string;
  summary: string;
  sections: LegalSection[];
}
