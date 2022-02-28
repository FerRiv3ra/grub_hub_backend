const initialDate = () => {
    const date = new Date();

    const days = [0, 1, 2, 3, 4, 5, 6];
    const dayNumber = new Date().getDay();
    const subsDays = days[dayNumber] * (-1);

    date.setDate(date.getDate() + subsDays);

    return (returnFormatDate(date));
}

const finalDate = (inicial) => {
    const [d, m, y] = inicial.split('/');
    const date = new Date(Number(y), Number(m) - 1, Number(d));

    date.setDate(date.getDate() + 6);

    return (returnFormatDate(date));
}

const converToDate = (dateString, type = 'start') => {
    const [d, m, y] = dateString.split('/');
    let date;
    if(type === 'start'){
        date = new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0);
    }else{
        date = new Date(Number(y), Number(m) - 1, Number(d), 23, 59, 59);
    }

    return (date);
}

const returnFormatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

module.exports = {
    initialDate,
    finalDate,
    converToDate
}