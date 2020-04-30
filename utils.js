function delay(time) {
    return new Promise(resolve =>
        setTimeout(resolve, time)
    );
}

async function startTimer(collecting, label, secs) {
    for (let i = secs; i >= 0; i--) {
        if (collecting)
            stateP.html(`Collecting Data for ${label}  ${i}  secs`)
        else
            stateP.html(`Starting to Collect Data in ${i} Secs .`)
        await delay(1000);
    }
}
