using System.Collections.Generic;

namespace StreetGangs.Core
{
    public static class CityCatalog
    {
        public static readonly string[] MainCities = { "المدينة الرئيسية", "القاهرة", "الرياض", "دبي", "باريس", "شنغهاي" };
        public static bool IsValid(string city) => System.Array.IndexOf(MainCities, city) >= 0;
    }
}
