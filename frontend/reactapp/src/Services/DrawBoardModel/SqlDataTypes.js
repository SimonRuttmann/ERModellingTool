/**
 * Allowed sql data types
 * These data types are oriented on the relational diagram
 * and will be replaced by the serverside generation of the sql code with the db specific data types
 * E.g. Text -> varchar(255)
 */

export const SqlDataTypes = {
    INT: "Integer",
    FLOAT: "Float",
    BOOLEAN: "Boolean",
    TEXT: "Text",
    DATE: "Date",
    TIMESTAMP: "Timestamp",
}