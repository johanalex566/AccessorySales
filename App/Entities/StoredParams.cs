namespace App.Entities
{
    public class StoredParams
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public int TypeOfParameter { get; set; }
        public StoredParams()
        {
            TypeOfParameter = (int)Enums.Enums.EnumTypeOfParameter.StringType;
        }
    }
}
