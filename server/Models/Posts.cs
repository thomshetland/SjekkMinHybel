using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace sjekkminhybel.Models
{
    public class Posts
    {
        public Posts() {}
        
        public Posts(int id, int rating, Enum school, string title, string content, string area, string building, string roomtype, DateTime time, ApplicationUser user)
        {
            Id = id;
            Rating = rating;
            School = school;
            Content = content;
            Title = title;
            Area = area;
            Building = building;
            RoomType = roomtype;
            Time = time;
            User = user;
        }

        public int Id { get; set; }

        [Required]
        [DisplayName("Rating")]
        public int Rating { get; set; } 

        [Required]
        [DisplayName("School")]
        public Enum School { get; set; }

        [Required]
        [DisplayName("Title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [DisplayName("Area")]
        public string Area { get; set; } = string.Empty;

        [Required]
        [DisplayName("Building")]
        public string Building{ get; set; } = string.Empty;

        [Required]
        [DisplayName("RoomType")]
        public string RoomType { get; set; } = string.Empty;

        [Required]
        [DisplayName("Content")]
        public string Content { get; set; } = string.Empty;

        [Required]
        [DisplayName("Time")]
        public DateTime Time { get; set; }


        
     
        public ApplicationUser? User { get; set; }
        
        public string UserId { get; set; }
        
       
    }
}