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
    this.tables = {}
  }

  async initStructure () {
    const __master = this.sequelize.define('sqlite_master', {
      name: Sequelize.STRING(100),
      sql: Sequelize.TEXT
    }, {
      timestamps: false, // 不要默认时间戳
      tableName: 'sqlite_master'
    })
    const res = await __master.findAll({attributes: ['name', 'sql']})
    this.tables = {}
    res.forEach(table => {
      table = table.dataValues
      if (table.name.indexOf('sqlite_autoindex') <= -1) {
        table.fields = table.sql.replace(/.*\((.*)\).*/, '$1').split(',');
        table.fields = table.fields.map(f => f.match(/(\S+)/g)[0])
        this.tables[table.name] = table;
      }
    });
  }

  // RefreshStructure () {
  //   this._initStructure();
  // }
  //     select * from sqlite_master where type = "table";

  // -- select * from sqlite_master where name = "app"

  // -- select * from sqlite_master where type="table" and name="app";

  select () {

  }
}

export default DBO
