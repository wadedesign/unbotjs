# Supabase SQL Setup Guide for Bot

## Introduction

This guide outlines the necessary SQL schemas and code snippets required to set up the database for your bot on Supabase. By following the instructions and SQL code provided, you will be able to configure the essential tables and relationships needed for your bot to function correctly.

## Prerequisites

- An active Supabase account.
- Basic understanding of SQL.
- Familiarity with your bot's data storage needs.

## Setting Up Your Database

### Creating Tables

Below are the SQL commands to create the fundamental tables for the bot. These include tables for users, messages, and any other essential entities your bot interacts with.

#### karma table

```sql
create table
  public.karma (
    user_id text not null,
    karma_points integer not null default 0,
    constraint karma_pkey primary key (user_id)
  ) tablespace pg_default;
```

#### karma_transactions table

```sql
create table
  public.karma_transactions (
    id serial,
    user_id text not null,
    karma_points_change integer not null,
    reason text null,
    transaction_date timestamp without time zone null default (now() at time zone 'utc'::text),
    giver_id text null,
    constraint karma_transactions_pkey primary key (id),
    constraint karma_transactions_user_id_fkey foreign key (user_id) references karma (user_id),
    constraint karma_transactions_giver_id_fkey foreign key (giver_id) references karma (user_id)
  ) tablespace pg_default;
```

>[!TIP]
> You can always change the table name - just better change it in the code also or you will get a funky answer!