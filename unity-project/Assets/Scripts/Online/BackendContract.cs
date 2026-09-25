namespace StreetGangs.Online
{
    // Network boundary: all economy/progression mutations must be validated remotely.
    // The Unity client never becomes the authority for money, XP, inventory or rewards.
    public interface IBackend
    {
        void EnsurePlayer();
        void CompleteMission(string missionId);
        void TrainStat(string stat);
        void Travel(string cityId);
    }
}
