/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

    // User model
module.exports = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {
        id : { type : 'integer', autoIncrement: true, unique : true, primaryKey : true },
        text : { type : 'string' },
        author : { type : 'string' },
        createdAt : { type : 'datetime' },
        updatedAt : { type : 'datetime' }
    }
};

