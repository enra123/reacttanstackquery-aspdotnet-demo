namespace reactdotnet.Server.Models
{
    public class Wcldata
    {
        public Wcldata() {
            Time = 0;
            AbilityId = "";
            AbilityName = "";
            ImgUrl = "";
        }
        public int Key { get; set; }
        public int Time { get; set; }

        public string AbilityId { get; set; }

        public string AbilityName { get; set; }

        public string ImgUrl { get; set; }

    }
}
