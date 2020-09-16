const { Sequelize } = require('sequelize')
const sqlite3 = require('sqlite3').verbose()

class DBO {

  private sequelize: any;

  tables: DBTable[] = [];

  constructor (dir: string) {
    this.sequelize = new Sequelize({
      dialectModule: sqlite3, 
      dialect: 'sqlite',
      storage: dir,
      logging: console.log
    })
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
    
    this.tables = []
    res.forEach((table: PlainObject) => {
      table = table.dataValues
      if (table.name.indexOf('sqlite_autoindex') <= -1) {
        table.fields = table.sql.replace(/.*\((.*)\).*/, '$1').split(',');
        table.fields = table.fields.map((f: string) => f.match(/(\S+)/g)![0])
        this.tables.push(table as DBTable);
      }
    });
    // this.exec('select * from file limit 0,5')
  }

  // RefreshStructure () {
  //   this._initStructure();
  // }
  //     select * from sqlite_master where type = "table";

  // -- select * from sqlite_master where name = "app"

  // -- select * from sqlite_master where type="table" and name="app";

  async select (sql: string) {
    // try {
      let list = await this.sequelize.query(sql, {type: Sequelize.QueryTypes.SELECT});
      list = multistageJson2single(list)
      return list;
    //   return { list }
    // } catch (err) {
    //   return { err }
    // }
  }

  async exec (sql: string) {
    const res = await this.sequelize.query(sql);
    return res;
  }
}

/** 多级json转单级 */
function multistageJson2single (json: PlainObject) {
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
