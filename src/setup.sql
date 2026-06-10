-- ========================================
-- DROP TABLES (safe reset order)
-- ========================================

DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;

-- ========================================
-- ORGANIZATION TABLE
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- PROJECT TABLE
-- ========================================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- CATEGORY TABLE
-- ========================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- PROJECT_CATEGORY (MANY-TO-MANY)
-- ========================================

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- INSERT ORGANIZATIONS
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ========================================
-- INSERT PROJECTS
-- ========================================

INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
(1, 'Build Community Library', 'Construct a small library for the local community.', 'Johannesburg', '2025-01-10'),
(1, 'School Renovation', 'Renovate classrooms and improve facilities.', 'Pretoria', '2025-02-15'),
(2, 'Urban Garden Setup', 'Create rooftop gardens.', 'Cape Town', '2025-01-12'),
(2, 'Food Distribution Drive', 'Distribute fresh produce.', 'Durban', '2025-03-22'),
(3, 'Food Bank Support', 'Help organize food donations.', 'Johannesburg', '2025-01-05'),
(3, 'Community Clean-Up', 'Clean local neighborhoods.', 'Soweto', '2025-05-22');

-- ========================================
-- INSERT CATEGORIES
-- ========================================

INSERT INTO category (name)
VALUES
('Construction'),
('Food Support'),
('Community Service');

-- ========================================
-- LINK PROJECTS TO CATEGORIES
-- ========================================

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 3),
(6, 3);