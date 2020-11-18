// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Sequelize, QueryTypes, DataTypes } from 'sequelize';
const sqlite3 = require('sqlite3').verbose();

/** 多级json转单级 */
function multistageJson2single(json: PlainObject): PlainObject {
  if (Array.isArray(json)) {
    json.forEach((item) => {
      for (const key in item) {
        if (typeof item[key] === 'object')
          item[key] = JSON.stringify(item[key]);
      }
    });
  } else {
    for (const key in json) {
      if (typeof json[key] === 'object') json[key] = JSON.stringify(json[key]);
    }
  }
  return json;
}

class DBO {
  private sequelize: Sequelize;

  tables: DBTable[] = [];

  constructor(dir: string) {
    this.sequelize = new Sequelize({
      dialectModule: sqlite3,
      dialect: 'sqlite',
      storage: dir,
      logging: console.log,
    });
  }

  async initStructure() {
    const __master = this.sequelize.define(
      'sqlite_master',
      {
        name: DataTypes.STRING(100),
        sql: DataTypes.TEXT,
      },
      {
        timestamps: false, // 不要默认时间戳
        tableName: 'sqlite_master',
      },
    );
    const res = await __master.findAll({ attributes: ['name', 'sql'] });
    if (res.length == 0) throw new Error('数据库连接失败');

    this.tables = [];
    res.forEach((table: PlainObject) => {
      table = table.dataValues;
      if (table.name.indexOf('sqlite_autoindex') <= -1) {
        table.fields = table.sql.replace(/.*\((.*)\).*/, '$1').split(',');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        table.fields = table.fields.map((f: string) => f.match(/(\S+)/g)![0]);
        this.tables.push(table as DBTable);
      }
    });
    // this.exec('select * from file limit 0,5')
  }

  // RefreshStructure () {
  //   this._initStructure();
  // }

  async SelectAndCount(
    tablename: string,
    index: number,
    size: number,
  ): Promise<{ total: number; list: PlainObject[] }> {
    const list = await this.sequelize.query(
      `select * from ${tablename} limit ${index * size}, ${size}`,
      {
        type: QueryTypes.SELECT,
      },
    );
    const total: { total: number } = await this.sequelize.query(
      `select count(*) as total from ${tablename}`,
      {
        type: QueryTypes.SELECT,
        plain: true,
      },
    );
    return Object.assign(total, { list });
  }

  async Exec(sql: string) {
    const type: QueryTypes = sql.match(/select/i)
      ? QueryTypes.SELECT
      : sql.match(/insert/i)
      ? QueryTypes.INSERT
      : QueryTypes.UPDATE;

    const res = await this.sequelize.query(sql, { type });
    return type === QueryTypes.SELECT ? res : [{ 'effect-row-number': res[1] }];
  }
}

export default DBO;
