using System;
using System.Collections.Generic;
using UnityEngine;

namespace StreetGangs.Core
{
    [Serializable]
    public class PlayerProfile
    {
        public string Id;
        public string DisplayName = "زعيم جديد";
        public int Level = 1;
        public int XP;
        public int Money = 2000;
        public int Energy = 100;
        public int MaxEnergy = 100;
        public int Stamina = 5;
        public int Reputation;
        public string CurrentCity = "المدينة الرئيسية";
        public PlayerStats Stats = new PlayerStats();
        public List<string> Inventory = new List<string>();
    }

    [Serializable]
    public class PlayerStats
    {
        public int Strength = 10;
        public int Speed = 10;
        public int Defense = 10;
        public int Accuracy = 10;
    }

    [Serializable]
    public class MissionDefinition
    {
        public string Id;
        public string Title;
        public string Type;
        public string Difficulty;
        public int RewardMoney;
        public int RewardXP;
        public int EnergyCost;
        public int OpponentPower;
    }

    public enum BattleSide { Player, Opponent }

    [Serializable]
    public class BattleState
    {
        public int PlayerHealth = 100;
        public int OpponentHealth = 100;
        public BattleSide Turn = BattleSide.Player;
        public bool Finished;
    }
}
