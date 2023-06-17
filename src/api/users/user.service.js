const pool = require("../../config/database");
const jwt = require("jsonwebtoken");

module.exports = {
  
  getJournalUsingJournalId: (journalId, callBack) => {
    pool.query(
      'SELECT * FROM journals WHERE id = ?',[journalId], (err, results) => {
        if (err) {
          console.error('Error retrieving journal:', err);
          callBack(err);
        }
        else  callBack(null, results);
      }
    );
  },
  getUsername: (username, callBack) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error retrieving user:', err);
        callBack(err);
      }
      return callBack(null, results);
    });
  },
  createNewJournal: ({ description,  publishedAt, teacherId }, callBack) => {
    pool.query('INSERT INTO journals (description, attachment, published_at, teacher_id) VALUES (?, ?, ?, ?)', [description,null,  publishedAt, teacherId], (err, results) => {
      if (err) {
        console.error('Error creating a new journal:', err);
        callBack(err);
      } else {
        callBack(null, results);
      }
    });
  },
  getJournalsFromDbwithFilter: (userId, role, callBack) => {
    if (role == 'teacher') {
      pool.query('SELECT * FROM journals WHERE teacher_id = ?', [userId], (err, results) => {
        if (err) {
          console.error('Error fetching journals:', err);
          callBack(err);
        } else {
          console.log('results', results)
          callBack(null, results);
        }
      });
    } else  {
      // Fetch all journals in which the student is tagged
      pool.query(
        'SELECT j.* FROM journals j INNER JOIN tagged_students ts ON j.id = ts.journal_id WHERE ts.student_id = ?', [userId], (err, results) => {
          if (err) {
            console.error('Error fetching journals:', err);
            callBack(err);
          } else {
            callBack(null, results);
          }
        }
      );






      // const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // console.log('currentDate', currentDate);
      // pool.query(
      // //   `SELECT j.* 
      // //  FROM journals j
      // //  INNER JOIN tagged_students ts ON j.id = ts.journal_id
      // //  WHERE ts.student_id = ? AND j.published_at <= ?
      // //  ORDER BY j.published_at DESC`,
      // 'SELECT j.* FROM journals j INNER JOIN tagged_students ts ON j.id = ts.journal_id WHERE ts.student_id = ? AND j.published_at <= NOW()',
      //   [userId, currentDate],
      //   (err, results) => {
      //     if (err) {
      //       console.error('Error fetching student journals:', err);
      //       callBack(err);
      //     } else {
            
      //       callBack(null, results);
      //     }
      //   }
      // );
    }
  },
  handleTaggedStudents: (taggedStudentsData, callBack) => {
    pool.query('INSERT INTO tagged_students (journal_id, student_id) VALUES ?', [taggedStudentsData], (err) => {
      if (err) {
        console.error('Error creating tagged students:', err);
        callBack(err);
      } else {
        callBack(null, taggedStudentsData);
      }
    });
  },
  insertNewUser: (newUser, callBack) => {

    pool.query('INSERT INTO users SET ?', newUser, (err) => {
      if (err) {
        console.error('Error creating a new user:', err);
        callBack(err);
      } else {
        callBack(null, newUser);
      }
    });
  },
  getUsername: (username, callBack) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error retrieving user:', err);
        callBack(err);
      }
      return callBack(null, results);
    });
  },
  generateJWT: (user) => {
    return jwt.sign(user, 'secret_key');
  },
  toJson: (user) => {
    const data = JSON.parse(JSON.stringify(user));
    return data;
  },


};
