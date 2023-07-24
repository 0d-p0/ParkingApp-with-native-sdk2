function DayTimePriceCalculate(start_time, end_time, data) {
  let dateTimeIn = new Date(start_time);
  const dateTimeOut = new Date(end_time);

  const endDateTime = new Date(dateTimeIn);
  endDateTime.setHours('00', '00');

  const filteredNightDayFlagDData = data.filter(
    obj => obj.night_day_flag === 'D',
  );

  let price = 0;
  let count = 0;
  let hourss = 0;
  let actualHours = 0;

  while (dateTimeOut >= endDateTime) {
    const {priceT, totalHours, actualHours} = calculatePriceTimeWise(
      dateTimeIn,
      dateTimeOut,
      data,
    );
    price += priceT;

    endDateTime.setDate(endDateTime.getDate() + 1);
    dateTimeIn = endDateTime;
  }

  if (actualHours > 24) {
    calculateDayWisePrice(filteredNightDayFlagDData, actualHours);
  }

  // console.log("price is ", price, "remaing hours is ", actualHours - 24);

  function calculatePriceTimeWise(date_time_in, date_time_out, data) {
    //   const matchingObjects = [];
    let priceT = 0;

    const inDateTime = new Date(date_time_in);
    const outDateTime = new Date(date_time_out);
    let totalHours = 0;
    if (actualHours == 0) {
      const timeDiffrence = outDateTime.getTime() - inDateTime.getTime();
      actualHours = Math.ceil(timeDiffrence / (1000 * 60 * 60));
    }
    //
    for (const object of data) {
      if (object.night_day_flag != 'O') {
        continue;
      }

      const fromTimeParts = object.from_hour.split(':');
      const toTimeParts = object.to_hour.split(':');

      const fromHour = parseInt(fromTimeParts[0], 10);
      const fromMinute = parseInt(fromTimeParts[1], 10);
      const toHour = parseInt(toTimeParts[0], 10);
      const toMinute = parseInt(toTimeParts[1], 10);

      const fromDateTime = new Date(inDateTime);
      fromDateTime.setHours(fromHour, fromMinute, 0, 0);

      const toDateTime = new Date(inDateTime);
      toDateTime.setHours(toHour, toMinute, 59, 999);

      if (inDateTime <= toDateTime && outDateTime >= fromDateTime) {
        const {calculateHours, currentHours} = calculateHourTimeWIse(
          inDateTime,
          date_time_out,
          object,
        );
        //   console.log("hey its hours", calculateHours);
        totalHours = calculateHours;

        if (object.rate_flag == 'F') {
          priceT += parseInt(object.vehicle_rate);
        }

        if (object.rate_flag == 'P') {
          priceT += parseInt(object.vehicle_rate) * currentHours;
        }

        if (filteredNightDayFlagDData.length > 0) {
          if (calculateHours > 24) {
            if (object.rate_flag == 'F') {
              priceT -= parseInt(object.vehicle_rate);
              console.log('subtarct the last vehicle price');
            }
            break;
          }
        }
      }
    }

    return {priceT, totalHours, actualHours};
  }

  function calculateHourTimeWIse(startTime, endTime, object) {
    //   console.log("runs", count);
    let currentHours = 0;
    let inDate = new Date(startTime);
    const fromTimeParts = object.from_hour.split(':');
    const toTimeParts = object.to_hour.split(':');

    const currentObjFromHour = new Date(inDate);
    currentObjFromHour.setHours(
      parseInt(fromTimeParts[0]),
      parseInt(fromTimeParts[1]),
    );
    const currentObjToHour = new Date(inDate);
    currentObjToHour.setHours(
      parseInt(toTimeParts[0]),
      parseInt(toTimeParts[1]),
    );

    if (count != 0) {
      inDate = currentObjFromHour;
    }
    //   console.log("dateIN is ", inDate.toLocaleString());
    //   console.log("dateout is ", endTime.toLocaleString());
    //   console.log("current obj  date is ", currentObjToHour.toLocaleString());

    if (currentObjToHour >= inDate && endTime >= currentObjToHour) {
      // console.log("IF BLOCK");
      hourss += Math.ceil((currentObjToHour - inDate) / (1000 * 60 * 60));
      currentHours = Math.ceil((currentObjToHour - inDate) / (1000 * 60 * 60));
    } else {
      // console.log("ELSE BLOCK");
      hourss += Math.ceil((endTime - inDate) / (1000 * 60 * 60));
      currentHours = Math.ceil((endTime - inDate) / (1000 * 60 * 60));
    }

    count++;

    return {calculateHours: hourss, currentHours: currentHours};
  }

  function calculateDayWisePrice(data, hour) {
    // console.log(hour)
    // console.log(data)
    hour = hour - 24;
    for (let item of data) {
      price += parseInt(item.vehicle_rate);
      if (hour >= item.from_hour && hour <= item.to_hour) {
        break;
      }
    }
  }

  return {price, actualHours};
}

export default DayTimePriceCalculate;
