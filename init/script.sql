CREATE TABLE IF NOT EXISTS report (
    report_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cat_name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    town VARCHAR(255) NOT NULL,
    missing_since DATE NOT NULL,
    mobile VARCHAR(15) DEFAULT NULL,
    email VARCHAR(320) DEFAULT NULL,
    created TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS image (
    image_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID NOT NULL,
    location VARCHAR(255) NOT NULL,
    CONSTRAINT fk_address
        FOREIGN KEY (report_id)
            REFERENCES report (report_id)
            ON DELETE CASCADE
);