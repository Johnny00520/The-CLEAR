const mongoose = require('mongoose');

const validate = (data) => {
    let errors = {};

    if(data.title === '') errors.title = 'Title cannot be empty';
    if(data.note === '') errors.note = 'Note cannot be empty';
    if(data.startDate === '') errors.startDate = "Start date cannot be empty";
    if(data.endDate === '') errors.endDate = "End date cannot be empty";

    const isValid = Object.keys(errors).length === 0;
    return { errors, isValid};
}

module.exports = (app, db) => {
    app.get('/api/events', (req, res) => {
        db.collection('events').find({}).toArray((err, events) => {
            if(err) {
                return res.status(500).json({ errors: { global: 'Something went wrong. Contact Administrator' }});
            } else {
                res.status(200).json({ events })
            }
        })
    });

    app.get('/api/events/:_id', (req, res) => {
        db.collection('events').findOne({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, event) => {
            if(err) throw err;

            return res.status(200).json({ event })
        })
    });

    app.put('/api/events/:_id', (req, res) => {
        const { errors, isValid } = validate(req.body);
        if(isValid) {
            let { 
                title,
                desc,
                eventDone,
                startDate,
                endDate,
                allDay,
                location
            } = req.body;
            if(eventDone === 'true') {
                eventDone = true
            } else {
                eventDone = false
            }
            if(allDay === 'false') {
                allDay = false
            } else {
                allDay = true
            }

            let startDateParse = new Date(startDate)
            let theStartDate = startDateParse.getFullYear() + '-' + (startDateParse.getMonth()+1) +'-'+ startDateParse.getDate();
            let theStartTime = startDateParse.getHours() + ':' + (startDateParse.getMinutes() < 10 ? '0': '') + startDateParse.getMinutes();
            let ampm = startDateParse.getHours() >= 12 ? 'PM' : 'AM';
            let theStartDateTime = theStartDate + ' & ' + theStartTime + ' ' + ampm;

            let endDateParse = new Date(endDate)
            let theEndDate = endDateParse.getFullYear() + '-' + (endDateParse.getMonth() + 1) + '-' + endDateParse.getDate();
            let theEndTime = endDateParse.getHours() + ':' + (endDateParse.getMinutes() < 10 ? '0' : '' ) + endDateParse.getMinutes();
            let AMPM = endDateParse.getHours() >= 12 ? 'PM' : 'AM';
            let theEndDateTime = theEndDate + ' & ' + theEndTime + ' ' + AMPM;
        
            const today = new Date();
            const compareDate = today.setDate(today.getDate());

            db.collection('events').findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(req.params._id) },
                { $set: {
                    title,
                    desc,
                    eventDone,
                    showStartTime: theStartDateTime,
                    showEndTime: theEndDateTime,
                    start: startDate,
                    end: endDate,
                    allDay,
                    location,
                    comparedDate: compareDate
                    },
                },
                { returnOriginal: false }, // This is important
                ( err, newEventResult ) => {
                    // console.log("result in db.collection: ", result)
                    if(err) {
                        return res.status(500).json({ errors: { global: err } });
                    } else {
                        res.status(200).json({
                            event: newEventResult.value
                        })
                    }
                }
            )

        } else {
            return res.status(400).json({ errors })
        }
    });

    app.post('/api/events', (req, res) => {
        const { errors, isValid } = validate(req.body);            
        if(isValid) {
            let {
                title,
                desc,
                eventDone,
                startDate,
                endDate,
                allDay,
                location
            } = req.body;
            if(eventDone === 'true') {
                eventDone = true
            } else {
                eventDone = false
            }
            if(allDay === 'false') {
                allDay = false
            } else {
                allDay = true
            }

            let startDateParse = new Date(startDate)
            let theStartDate = startDateParse.getFullYear() + '-' + (startDateParse.getMonth()+1) +'-'+ startDateParse.getDate();
            let theStartTime = startDateParse.getHours() + ':' + (startDateParse.getMinutes() < 10 ? '0': '') + startDateParse.getMinutes();
            let ampm = startDateParse.getHours() >= 12 ? 'PM' : 'AM';
            let theStartDateTime = theStartDate + ' & ' + theStartTime + ' ' + ampm;

            let endDateParse = new Date(endDate)
            let theEndDate = endDateParse.getFullYear() + '-' + (endDateParse.getMonth() + 1) + '-' + endDateParse.getDate();
            let theEndTime = endDateParse.getHours() + ':' + (endDateParse.getMinutes() < 10 ? '0' : '' ) + endDateParse.getMinutes();
            let AMPM = endDateParse.getHours() >= 12 ? 'PM' : 'AM';
            let theEndDateTime = theEndDate + ' & ' + theEndTime + ' ' + AMPM;
        
            const today = new Date();
            const compareDate = today.setDate(today.getDate());

            db.collection('events').insertOne({
                title,
                desc,
                eventDone,
                showStartTime: theStartDateTime,
                showEndTime: theEndDateTime,
                start: startDate,
                end: endDate,
                allDay,
                location,
                comparedDate: compareDate
            }, (err, result) => {
                if(err) {
                    return res.status(500).json({ errors: { global: 'Something went wrong in database' }});
                } else {
                    res.status(200).json({ event: result.ops[0] });
                }
            })

        } else {
            return res.status(400).json({ errors })
        }

    });

    app.delete('/api/events/:_id', (req, res) => {
        db.collection('events').findOneAndDelete(
            { _id: new mongoose.Types.ObjectId(req.params._id) },
            (err, event) => {
                
                if(err) {
                    console.log("err in findOneAndDelete: ", err)
                    return res.status(500).json({ errors: { global: err } });
                } else {
                    res.status(200).json({ message: 'successful' });
                }
            }
        )
    });
}