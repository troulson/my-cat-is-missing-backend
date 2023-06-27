export class Config {

    static LOCAL: any = {
        // Endpoint
        HOST: 'postgresql-local',
        PORT: 5432,
        USER: 'postgres',   // Database username
        PASSWORD: 'postgres',
        DATABASE: 'mycatismissing'
    }

    static RDS: any = {
        // Endpoint
        // Again, never have expose database credentials in production.
        HOST: 'mycatismissingbackendstack-dbinstance9e2e5045-ex8cnpwe1ghl.cayj132ybe9x.us-east-1.rds.amazonaws.com',
        PORT: 5432,
        USER: 'postgres',   // Database username
        PASSWORD: 'Q5xtBNrQu3jC',
        DATABASE: 'mycatismissing'
    }
}