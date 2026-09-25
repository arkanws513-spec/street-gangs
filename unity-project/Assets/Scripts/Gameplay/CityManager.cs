using UnityEngine;
using StreetGangs.Core;

namespace StreetGangs.Gameplay
{
    public class CityManager : MonoBehaviour
    {
        public bool TravelTo(string city)
        {
            if (!CityCatalog.IsValid(city)) return false;
            GameState.Instance.Player.CurrentCity = city;
            return true;
        }
    }
}
