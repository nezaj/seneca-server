const _ = require('lodash')
const { Model, QueryBuilder, transaction } = require('objection');
const bcrypt = require('bcrypt-nodejs');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get QueryBuilder() {
    return class extends QueryBuilder {
      findById(id) {
        return this.where({id}).first();
      }
      findByEmail(email) {
        return this.where({email}).first();
      }
    }
  };

  static create(data) {
    return transaction(this, async User => {
      data.user.password = bcrypt.hashSync(data.user.password);
      return await User.query().insert(data.user);
    });
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    return _.omit(json, 'password');
  }
};

module.exports = User;
