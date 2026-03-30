CREATE TABLE IF NOT EXISTS hero_section (
    id SERIAL PRIMARY KEY,
    headline VARCHAR(255) NOT NULL,
    subheadline VARCHAR(255),
    cta_text VARCHAR(255),
    hero_image_url VARCHAR(255) NOT NULL,
    hero_image_alt_text VARCHAR(255) NOT NULL,
    max_width VARCHAR(50) NOT NULL,
    max_height VARCHAR(50) NOT NULL,
    object_fit VARCHAR(50) NOT NULL
);

INSERT INTO hero_section (
    headline, 
    subheadline, 
    cta_text, 
    hero_image_url, 
    hero_image_alt_text, 
    max_width, 
    max_height, 
    object_fit
) VALUES (
    'Faith. Family. Responsibility.',
    'Building a Better Future for Our Community',
    'Join the Campaign',
    'https://cdn.craft4commissioner.com/img/01-11-25%20Craft%20Family-5.jpg',
    'Eric Craft and Family',
    '100%',
    '600px',
    'cover'
);
