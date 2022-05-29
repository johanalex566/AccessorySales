using System.Text.Json.Serialization;

namespace XamarinAppExam.Model
{
    public class Book
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("author")]
        public string Author { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }
    }
}
