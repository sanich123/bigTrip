import dayjs from 'dayjs';

export const priceAndTrip = (points) => {

  const totalPrice = points.slice().reduce((accumulator, it) => accumulator + it.basePrice, 0);
  const cities = new Set(points.slice().map((it) => it.destination.name));
  const threeCities = Array.from(cities);
  const firstCity = threeCities[0];
  const thirdCity = threeCities[threeCities.length - 1];
  const secondCity = threeCities.length === 3 ? threeCities[threeCities.length / 2] : '...';

  const fromDate = dayjs(points[0].dateFrom).format('MMMM DD');
  const toDate = dayjs(points[points.length - 1].dateTo).format('MMMM DD');

  //Не забыть, что points отсортированы в main по дате, это может измениться

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${firstCity} — ${secondCity} — ${thirdCity}</h1>

    <p class="trip-info__dates">${fromDate}&nbsp;—&nbsp;${toDate}</p>
  </div>

  <p class="trip-info__cost">
    Total: €&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>
</section>`;
};
