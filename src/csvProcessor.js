const User = require('./userModel');

const processCSVData = async (data) => {
    for (let row of data) {
        const user = transformRow(row);
        await insertIntoDatabase(user);
    }
    await printAgeDistribution();
};

const transformRow = (row) => {
    const user = {
        name: `${row['name.firstName']} ${row['name.lastName']}`,
        age: parseInt(row['age']),
        address: {
            line1: row['address.line1'],
            line2: row['address.line2'],
            city: row['address.city'],
            state: row['address.state']
        },
        additional_info: {}
    };

    for (let key in row) {
        if (!['name.firstName', 'name.lastName', 'age', 'address.line1', 'address.line2', 'address.city', 'address.state'].includes(key)) {
            user.additional_info[key] = row[key];
        }
    }

    return user;
};

const insertIntoDatabase = async (user) => {
    const newUser = new User(user);
    await newUser.save();
};

const printAgeDistribution = async () => {
    const users = await User.find();
    const total = users.length;

    const ageGroups = {
        '< 20': 0,
        '20 to 40': 0,
        '40 to 60': 0,
        '> 60': 0
    };

    users.forEach(user => {
        if (user.age < 20) ageGroups['< 20']++;
        else if (user.age >= 20 && user.age <= 40) ageGroups['20 to 40']++;
        else if (user.age > 40 && user.age <= 60) ageGroups['40 to 60']++;
        else ageGroups['> 60']++;
    });

    console.log("Age-Group % Distribution");
    for (let group in ageGroups) {
        const percentage = ((ageGroups[group] / total) * 100).toFixed(2);
        console.log(`${group}: ${percentage}%`);
    }
};

module.exports = processCSVData;
