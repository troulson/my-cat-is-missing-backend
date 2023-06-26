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
        HOST: 'mycatismissingbackendstack-dbinstance9e2e5045-sozt7u7nvsvr.cayj132ybe9x.us-east-1.rds.amazonaws.com',
        PORT: 5432,
        USER: 'postgres',   // Database username
        PASSWORD: 'Q5xtBNrQu3jC',
        DATABASE: 'mycatismissing'
    }
}