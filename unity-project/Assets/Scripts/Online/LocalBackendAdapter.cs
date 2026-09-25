using UnityEngine;
using StreetGangs.Core;
using StreetGangs.Gameplay;

namespace StreetGangs.Online
{
    public class LocalBackendAdapter : MonoBehaviour, IBackend
    {
        public void EnsurePlayer() { }
        public void CompleteMission(string missionId) { }
        public void TrainStat(string stat) { GetComponent<TrainingController>()?.Train(stat); }
        public void Travel(string cityId) { GetComponent<CityManager>()?.TravelTo(cityId); }
    }
}
