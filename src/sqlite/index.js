const { Sequelize } = require('sequelize')
const sqlite3 = require('sqlite3').verbose()

class DBO {
  constructor (dir) {
    this.sequelize = new Sequelize({
      dialectModule: sqlite3, 
      dialect: 'sqlite',
      storage: dir || '/Users/aliya/.pax-prd-test/20200721163847/db/data.sqlite',
      logging: console.log
    })
    this.tables = []
    this._initStructure()
  }

  async _initStructure () {
    const __master = this.sequelize.define('sqlite_master', {
      name: Sequelize.STRING(100),
      sql: Sequelize.TEXT
    }, {
      timestamps: false, // 不要默认时间戳
      tableName: 'sqlite_master'
    })
    const res = await __master.findAll({attributes: ['name', 'sql']})
    this.tables = []
    res.forEach(table => {
      if (table.name.indexOf('sqlite_autoindex') <= -1) {
        table.field = table.sql.replace(/.*\((.*)\).*/, '$1').match(/ {4}(\S+)/g);
        this.tables[table.name] = table;
      }
    });
    console.log('---55--', this.tables)
  }

  RefreshStructure () {
    this._initStructure();
  }
  //     select * from sqlite_master where type = "table";

  // -- select * from sqlite_master where name = "app"

  // -- select * from sqlite_master where type="table" and name="app";

  select () {

  }
}

export default DBO
