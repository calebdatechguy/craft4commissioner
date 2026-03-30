CREATE TABLE IF NOT EXISTS "candidate_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"district" varchar(255) NOT NULL,
	"slogan" varchar(255) NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"bio_summary" text NOT NULL,
	"bio_history_years" integer NOT NULL,
	"bio_residency_years" integer NOT NULL,
	"bio_background" text NOT NULL,
	"bio_family_info" text NOT NULL,
	"bio_job_description" text NOT NULL,
	"values" jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS "campaign_priorities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL
);

-- Insert initial data for candidate_profile
INSERT INTO "candidate_profile" (
    "name", "title", "district", "slogan", "image_url", 
    "bio_summary", "bio_history_years", "bio_residency_years", 
    "bio_background", "bio_family_info", "bio_job_description", "values"
) VALUES (
    'Eric Craft', 
    'Barrow County Commissioner District 4 Candidate', 
    'District 4', 
    'Faith. Family. Responsibility.', 
    'https://placehold.co/600x400', 
    'Eric Craft is a dedicated family man and community leader running for Barrow County Commissioner to bring integrity, faith, and fiscal responsibility to District 4.', 
    23, 
    22, 
    'A dedicated family man with a normal job, deeply rooted in the community. Eric serves on the Salvation Army board, demonstrating his commitment to helping those in need.', 
    'Eric is a devoted husband and father who understands the challenges facing Barrow County families.', 
    'Eric has spent over two decades working in the county, bringing real-world experience to the table.', 
    '["Integrity over Ambition", "Faith-Based Leadership", "People Over Pockets", "Unity Under the Constitution"]'
);

-- Insert initial data for campaign_priorities
INSERT INTO "campaign_priorities" ("title", "description", "category") VALUES
('Public Safety First', 'Unwavering support for our Police Department, EMS, and Fire services. Ensuring they have the resources they need to keep us safe.', 'Public Safety'),
('School Security', 'Increasing the presence of School Resource Officers (SROs) to protect our children and educators.', 'Education'),
('Community Listening', 'A commitment to listening to the concerns of District 4 residents and acting on them.', 'Community'),
('Fiscal Responsibility', 'Addressing county allocations with a ''People Over Pockets'' mindset, ensuring tax dollars are spent wisely.', 'Fiscal'),
('Faith-Based Values', 'Leading with integrity and values rooted in faith.', 'Faith');
