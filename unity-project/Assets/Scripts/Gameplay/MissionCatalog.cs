using System.Collections.Generic;
using StreetGangs.Core;

namespace StreetGangs.Gameplay
{
    public static class MissionCatalog
    {
        public static List<MissionDefinition> GetForLevel(int level)
        {
            return new List<MissionDefinition>
            {
                new MissionDefinition { Id="m1", Title="توصيل آمن", Type="توصيل", Difficulty="سهل", RewardMoney=180, RewardXP=18, EnergyCost=8, OpponentPower=35 },
                new MissionDefinition { Id="m2", Title="استعادة شحنة", Type="استرداد", Difficulty="متوسط", RewardMoney=320, RewardXP=24, EnergyCost=12, OpponentPower=55 },
                new MissionDefinition { Id="m3", Title="حماية تاجر", Type="حماية", Difficulty="صعب", RewardMoney=520, RewardXP=32, EnergyCost=18, OpponentPower=85 },
                new MissionDefinition { Id="m4", Title="طلب خاص", Type="خاص", Difficulty="خبير", RewardMoney=800, RewardXP=40, EnergyCost=25, OpponentPower=120 }
            };
        }
    }
}
