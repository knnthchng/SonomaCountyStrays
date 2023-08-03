drop table if exists pets;

Create Table "pets" (
"Name" VARCHAR,
"Type" VARCHAR,
"Breed" VARCHAR,
"Color" VARCHAR,
"Sex" VARCHAR,
"Size" VARCHAR,
"Date Of Birth" DATE,
"Impound Number" VARCHAR,
"Kennel Number" VARCHAR,
"Animal ID" VARCHAR,
"Intake Date" DATE,
"Outcome Date" DATE,
"Days in Shelter" FLOAT,
"Intake Type" VARCHAR,
"Intake Subtype" VARCHAR,
"Outcome Type" VARCHAR,
"Outcome Subtype" VARCHAR,
"Intake Condition" VARCHAR,
"Outcome Condition" VARCHAR,
"Intake Jurisdiction" VARCHAR,
"Outcome Jurisdiction" VARCHAR,
"Outcome Zip Code" VARCHAR,
"Count" INT,
"Latitude" NUMERIC(10,6),
"Longitude" NUMERIC(10,6));

select * from pets;