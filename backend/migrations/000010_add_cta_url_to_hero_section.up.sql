ALTER TABLE hero_section ADD COLUMN cta_url VARCHAR(255);
UPDATE hero_section SET cta_url = 'https://secure.winred.com/craft4commissioner/donate-today' WHERE cta_url IS NULL;
