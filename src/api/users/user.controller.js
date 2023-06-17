const {
  getUsername,
  insertNewUser,
  generateJWT,
  toJson,
  createNewJournal,
  handleTaggedStudents,
  getJournalsFromDb,
  getJournalsFromDbwithFilter,
  getJournalUsingJournalId
} = require("./user.service");
const db = require("../../config/database");
const jwt = require("jsonwebtoken");

module.exports = {

  login: (req, res) => {
    try {
      const { username, password, role } = req.body;
      getUsername(username, (err, results) => {
        if (err) {
          console.error('Error retrieving user:', err);
        }
        if (!results) {
          return res.json({ data: "Invalid email or password" });
        }
        if (results.length === 0) {
          // User does not exist, create a new user and generate JWT
          const newUser = {
            username,
            password,
            role
          };
          insertNewUser(newUser, (err, results) => {
            if (err) {
              console.error('Error creating a new user:', err);
              res.json({ message: "Error while creating a new user" }).sendStatus(500);
            }
            else {
              const token = generateJWT(newUser);
              getUsername(username, (err, results) => {
                if (err) {
                  console.error('Error retrieving user:', err);
                }
                else {
                  const createdUser = results[0];
                  const data = toJson(createdUser);
                  return res.json({ data, token });
                }
              })
            }
          });
        } else {
          // User exists, generate JWT
          const existingUser = results[0];
          const data = toJson(existingUser);
          const token = generateJWT(data);
          res.json({ existingUser, token });
        }
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: "something went wrong while logging in" }).sendStatus(500);
    }

  },
  createJournal: (req, res) => {
    const { description, taggedStudents,  teacherId } = req.body;
    let { publishedAt } = req.body;
    // const publishedAt = new Date();
    const { role } = req.user;

    if (role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create journals.' });
    }
   publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    
    createNewJournal({ description,  publishedAt, teacherId }, (err, results) => {
      if (err) {
        console.error('Error creating a new journal:', err);
        res.json({ message: "Error while creating a new journal" }).sendStatus(500);
      }
      else {
        const journalId = results.insertId;

        // Create associations between journal and tagged students
        const taggedStudentsData = taggedStudents.map((studentId) => [journalId, studentId]);
        handleTaggedStudents(taggedStudentsData, (err, curr) => {
          if (err) {
            console.error('Error creating associations between journal and tagged students:', err);
            return res.json({ message: "Error while creating associations between journal and tagged students" }).sendStatus(500);
          }else {
            getJournalUsingJournalId(journalId, (err, results) => {
              if (err) {
                console.error('Error retrieving journal:', err);
                res.json({ message: "Error while retrieving journal" }).sendStatus(500);
              }
              else {
                const data = toJson(results[0]);
                 res.json({ data,message: "Journal created successfully"});
              }
            });
          }
        });

        
      }
    });
  },
  getJournals: (req, res) => {
    const { userId } = req.body;
    const { role } = req.user;

    getJournalsFromDbwithFilter(userId, role, (err, results) => {
      if (err) {
        console.error('Error retrieving journals:', err);
        res.json({ message: "Error while retrieving journals" }).sendStatus(500);
      }
      else {
        console.log(results[0])
        // console.log("Ssssssssssssssssssssssss",results);
        if (results.length === 0) {
          return res.json({ message: "No journals found related to this ID", data: results });
        }
        else {
          const data=toJson(results);
          return res.json({ data });
        }
        
      }
    });

  },
  updateJournal: (req, res) => {
    console.log("fgwfwefwefwfewf")
    const { id } = req.params;
    const { description, taggedStudents, attachment, teacherId } = req.body;
    const { role } = req.user;

    // Check if the user is a teacher
    if (role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can update journals.' });
    }

    // Update the journal entry
    db.query('UPDATE journals SET description = ?, attachment = ? WHERE id = ? AND teacher_id = ?',
      [description, attachment, id, teacherId],
      (err, result) => {
        if (err) {
          console.error('Error updating the journal:', err);
          res.sendStatus(500);
        } else if (result.affectedRows === 0) {
          // No rows were affected, meaning the journal doesn't exist or the teacher doesn't own it
          res.status(404).json({ error: 'Journal not found.' });
        } else {
          // Update the tagged students
          db.query(
            'DELETE FROM tagged_students WHERE journal_id = ?',
            [id],
            (err) => {
              if (err) {
                console.error('Error deleting tagged students:', err);
                res.sendStatus(500);
              } else {
                const taggedStudentsData = taggedStudents.map((studentId) => [id, studentId]);

                handleTaggedStudents(taggedStudentsData, (err, results) => {
                  if (err) {
                    console.error('Error creating associations between journal and tagged students:', err);
                    res.json({ message: "Error while creating associations between journal and tagged students" }).sendStatus(500);
                  }
                }
                );
                res.json({ message: "Journal updated successfully" });
              }
            }
          );
        }
      }
    );
  },
  deleteJournal: (req, res) => {
    const { id } = req.params;
    const { teacherId } = req.body;
    const { role } = req.user;


    // Check if the user is a teacher
    if (role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can delete journals.' });
    }

    // Delete the journal entry
    db.query(
      'DELETE FROM journals WHERE id = ? AND teacher_id = ?',
      [id, teacherId],
      (err, result) => {
        if (err) {
          console.error('Error deleting the journal:', err);
          return res.sendStatus(500);
        } else if (result.affectedRows === 0) {
          // No rows were affected, meaning the journal doesn't exist or the teacher doesn't own it
          return res.status(404).json({ error: 'Journal not found.' });
        } else {
          db.query('DELETE FROM tagged_students WHERE journal_id = ?', [id], (err) => {
            if (err) {
              console.error('Error deleting tagged students:', err);
              return res.json({message:"Error while deleting tagged students"}).sendStatus(500);
            } else {
              return res.json({ message: "Journal deleted successfully" }).sendStatus(204);
            }
          });
          // res.json({ message: "Journal deleted successfully" }).sendStatus(204);
        }
      }
    );
  },
  uploadAttachment: (req, res) => {
    const { file } = req;
    const { role } = req.user;
    const {journalId}=req.body

    // Check if the user is a teacher
    if (role !== 'teacher') {
       res.status(403).json({ error: 'Only teachers can upload attachments.' });
    }

    if (!file) {
       res.status(400).json({ error: 'No file uploaded.' });
      retu
    }
    const url=`${req.protocol}://${req.get('host')}/attachments/${file.filename}`;  
    db.query(
      'UPDATE journals SET attachment = ? WHERE id = ?',
      [url, journalId],
      (err, result) => {
        if (err) {
          console.error('Error updating the journal:', err);
           res.sendStatus(500);
        } else if (result.affectedRows === 0) {
          // No rows were affected, meaning the journal doesn't exist or the teacher doesn't own it
           res.status(404).json({ error: 'Journal not found.' });
        } else {
          db.query('SELECT * FROM journals WHERE id = ?', [journalId], (err, result) => {
            if (err) {
              console.error('Error retrieving the journal:', err);

            } else if (result.length === 0) {
              // No rows were affected, meaning the journal doesn't exist or the teacher doesn't own it
                res.status(404).json({ error: 'Journal not found.' });
            } else {
              const data=toJson(result[0]);
              res.json({ message: "Attachment uploaded successfully",data:data });
            }
          });
        }
      }
    );  
      
  },
  getStudents: (req, res) => {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can access this endpoint.' });
    }
  
    // Query all students from the user table
    db.query('SELECT * FROM users WHERE role = ?', ['student'], (err, results) => {
      if (err) {
        console.error('Error fetching students:', err);
        res.sendStatus(500);
      } else {
        res.json({data:toJson(results)});
      }
    });
  }
};
