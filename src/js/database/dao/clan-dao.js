class ClanDAO {

    constructor(db) {
        this.db = db
    }

    insertClan(clan) {
        // const values = [
        //     Date.now(),
        //     Date.now()
        // ]
        // const args = [
        //     'created_at',
        //     'updated_at'
        // ]
        // const n = [
        //     '?',
        //     '?'
        // ]
        // const updateSet = []
        // Object.entries(clan).forEach(([key, data]) => {
        //     if (clanModel.hasOwnProperty(key)) {
        //         const keyName = playerModel[key].name
        //         args.push(keyName)
        //         values.push(data)
        //         n.push('?')
        //         if (keyName !== 'tag') {
        //             updateSet.push(`${keyName}=?`)
        //             values.push(data)
        //         }
        //     }
        // })
        // updateSet.push(`updated_at=?`)
        // values.push(Date.now())
        // const sqlInsert=`INSERT INTO players(${args.join(",")}) VALUES(${n.join(",")})`
        // const sqlOnConflict = `ON CONFLICT(tag) DO UPDATE SET ${updateSet.join(",")}`
        // const sqlTarget = `WHERE tag=?`
        // const sql = `${sqlInsert} ${sqlOnConflict} ${sqlTarget}`
        // values.push(player.tag)
        // this.db.run(
        //     sql,
        //     values
        // ).catch(error => {
        //     console.log(error)
        // })
    }

}

module.exports = ClanDAO