CREATE TABLE IF NOT EXISTS report (
    report_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_location VARCHAR(512) DEFAULT 'https://mcim-image-bucket.s3.amazonaws.com/beefcake.jpg' NOT NULL ,
    cat_name VARCHAR(255) NOT NULL,
    content VARCHAR(1024) NOT NULL,
    country VARCHAR(255) NOT NULL,
    town VARCHAR(255) NOT NULL,
    missing_since DATE NOT NULL,
    email VARCHAR(320) DEFAULT NULL,
    created TIMESTAMP NOT NULL
);
