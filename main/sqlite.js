const { Sequelize } = require('sequelize')
const sqlite3 = require('sqlite3').verbose()

class DBO {
  constructor (dir) {
    this.sequelize = new Sequelize({
      dialectModule: sqlite3, 
      dialect: 'sqlite',
      storage: dir,
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
    if (res.length == 0) throw new Error('数据库连接失败')
    
    this.tables = {}
    res.forEach(table => {
      table = table.dataValues
      if (table.name.indexOf('sqlite_autoindex') <= -1) {
        table.fields = table.sql.replace(/.*\((.*)\).*/, '$1').split(',');
        table.fields = table.fields.map(f => f.match(/(\S+)/g)[0])
        this.tables[table.name] = table;
      }
    });
    // console.log('this.tables', res)
    // this.exec('select * from file limit 0,5')
  }

  // RefreshStructure () {
  //   this._initStructure();
  // }
  //     select * from sqlite_master where type = "table";

  // -- select * from sqlite_master where name = "app"

  // -- select * from sqlite_master where type="table" and name="app";

  async select (sql) {
    // try {
      let list = await this.sequelize.query(sql, {type: Sequelize.QueryTypes.SELECT});
      list = multistageJson2single(list)
      return list;
    //   return { list }
    // } catch (err) {
    //   return { err }
    // }
  }

  async exec (sql) {
    const res = await this.sequelize.query(sql);
    return res;
  }
}

/** 多级json转单级 */
function multistageJson2single (json) {
  if (Array.isArray(json)) {
    json.forEach(item => {
      for (let key in item) {
        if (typeof item[key] === 'object') item[key] = JSON.stringify(item[key]);
      }
    })
  } else {
    for (let key in json) {
      if (typeof json[key] === 'object') json[key] = JSON.stringify(json[key]);
    }
  }
  return json;
}

export default DBO
