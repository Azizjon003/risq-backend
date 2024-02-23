export type SortModel = {
  column: string;
  value: string;
};
export type FilterModel = {
  column: string;
  value: string;
};
type searchSegment = {
  page: number;
  limit: number;
  filter: FilterModel[];
  sort: SortModel[];
};

export class AdvancedFilter {
  constructor() {}
  createFilter(searchSegment: searchSegment) {
    const { filter, sort, limit, page } = searchSegment;
    const { take, skip } = this.getPagenation(page, limit);
    let where: any = { AND: [] };
    let orderBy: any = {};

    console.log(filter, "filter");

    sort.forEach((_sort) => {
      orderBy[_sort.column] = _sort.value.trim();
    });

    filter &&
      filter.forEach((_filter) => {
        const obj = this.buildColumnFilter(_filter.column, _filter.value);

        where.AND.push(obj);
      });

    return { take, skip, orderBy, where };
  }

  private buildColumnFilter = (column: string, value: string) => {
    const values = value.split(",");
    let andArray: any = [],
      orArray: any = [];

    values.forEach((value) => {
      const filterType = this.getFilterType(column, value);

      const obj = column
        .split(".")
        .reduceRight((o, x) => ({ [x]: o }), { ...filterType });

      if (Object.keys(filterType)[0] === "not") {
        andArray.push(obj);
      } else {
        orArray.push(obj);
      }
    });

    if (andArray.length > 0 && orArray.length > 0) {
      return {
        AND: [...andArray, { OR: [...orArray] }],
      };
    } else if (andArray.length > 0) {
      return {
        AND: [...andArray],
      };
    } else {
      return {
        OR: [...orArray],
      };
    }
  };

  private getFilterType = (column: string, value: string) => {
    if (
      column.toLowerCase().indexOf("datetime") > -1 ||
      column.toLowerCase().indexOf("created") > -1 ||
      column.toLowerCase().indexOf("time") > -1
    ) {
      return this.getDateTimeFilterType(column, value);
    }
    if (
      value.toLowerCase().indexOf(">") > -1 ||
      value.toLowerCase().indexOf("<") > -1 ||
      value.toLowerCase().indexOf("..") > -1
    ) {
      return this.getFilterTypeOld(column, value);
    }

    value = value.trim();
    let _obj: any = {};
    let pointer;

    let sanatizedvalue = value;

    let firstChar = value[0];
    const secondChar = value[1];
    const lastChar = value[value.length - 1];

    let isNot = false;

    if (firstChar === "!") {
      firstChar = secondChar;
      _obj["not"] = {};
      pointer = _obj["not"];
      isNot = true;

      if (lastChar === "*") {
        sanatizedvalue = sanatizedvalue.substring(1, value.length - 1);
      } else {
        sanatizedvalue = sanatizedvalue.substring(1, value.length);
      }
    } else {
      pointer = _obj;
    }

    if (firstChar === "*" && lastChar === "*") {
      sanatizedvalue = sanatizedvalue.substring(1, value.length - 1);
      pointer["contains"] = sanatizedvalue;
    } else if (firstChar === "*") {
      sanatizedvalue = sanatizedvalue.substring(1, value.length);
      pointer["endsWith"] = sanatizedvalue;
    } else if (lastChar === "*") {
      sanatizedvalue = sanatizedvalue.substring(0, value.length - 1);
      pointer["startsWith"] = sanatizedvalue;
    } else {
      pointer["equals"] = sanatizedvalue;
    }

    return _obj;
  };

  private getDateTimeFilterType = (column: string, value: string) => {
    value = value.trim();

    let _obj: any = {};

    if (value.startsWith("..")) {
      let date: Date = new Date(value.replace("..", ""));
      _obj["lte"] = date;
    } else if (value.endsWith("..")) {
      const date: Date = new Date(value.replace("..", ""));
      _obj["gte"] = date;
    } else if (value.indexOf("..") !== -1) {
      const dateGreater: Date = new Date(
        value.substring(0, value.indexOf(".."))
      );
      const dateLessen: Date = new Date(
        value.substring(value.indexOf("..") + 2, value.length)
      );

      _obj["gte"] = dateGreater;
      _obj["lte"] = dateLessen;
    } else if (value.startsWith(">")) {
      const dataGreater: Date = new Date(value.replace(">", ""));
      _obj["gte"] = dataGreater;
    } else if (value.startsWith("<")) {
      const dateLesthen = new Date(value.replace("<", ""));
      _obj["lte"] = dateLesthen;
    } else {
      const date = new Date(value);
      _obj["gte"] = date;
      _obj["lte"] = new Date(date.getTime() + 60 * 60 * 24 * 1000);
    }
    return _obj;
  };

  private getFilterTypeOld = (column: string, value: string) => {
    value = value.trim();

    let _obj: any = {};

    if (value.startsWith("..")) {
      let date = value.replace("..", "");
      _obj["lte"] = Number(date.trim());
    } else if (value.endsWith("..")) {
      const date = value.replace("..", "");
      _obj["gte"] = Number(date.trim());
    } else if (value.indexOf("..") !== -1) {
      const dateGreater = value.substring(0, value.indexOf(".."));
      const dateLessen = value.substring(value.indexOf("..") + 2, value.length);

      if (Number(dateGreater.trim()) <= Number(dateLessen.trim())) {
        _obj["gte"] = Number(dateGreater.trim());
        _obj["lte"] = Number(dateLessen.trim());
      } else {
        _obj["gte"] = Number(dateLessen.trim());
        _obj["lte"] = Number(dateGreater.trim());
      }
    } else if (value.startsWith(">")) {
      const dataGreater = value.replace(">", "").trim();
      _obj["gte"] = Number(dataGreater);
    } else if (value.startsWith("<")) {
      const dateLesthen = value.replace("<", "").trim();
      _obj["lte"] = Number(dateLesthen);
    } else {
    }

    return _obj;
  };

  private getPagenation = (page: number, limit: number) => {
    const offset = page * limit - limit;

    return {
      take: limit,
      skip: offset,
    };
  };

  private calculateCoordinates = (
    latitude: any,
    longitude: any,
    distance: any
  ) => {
    // Radius of the Earth in miles
    const earthRadius = 3958.8; // This is a rough estimate; the Earth is not a perfect sphere.

    // Convert latitude and longitude from degrees to radians
    const lat1 = latitude * (Math.PI / 180);
    const lon1 = longitude * (Math.PI / 180);

    // Calculate the new latitude
    const lat2 = lat1 + (distance / earthRadius) * (180 / Math.PI);

    // Calculate the change in longitude for the given latitude
    const dLon = Math.asin(
      Math.sin(distance / (2 * earthRadius)) / Math.cos(lat1)
    );

    // Calculate the new longitude
    const lon2 = lon1 + dLon * (180 / Math.PI);

    // Convert the new latitude and longitude from radians back to degrees
    const newLatitude = lat2 * (180 / Math.PI);
    const newLongitude = lon2 * (180 / Math.PI);

    return [newLatitude, newLongitude];
  };
}
