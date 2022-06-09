using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace App.Helper
{
    public static class DataHelper
    {
        public static List<T> DataTableToList<T>(this DataTable table) where T : class, new()
        {
            try
            {
                return table.AsEnumerable().DataTableToList<T>();
            }
            catch
            {
                return null;
            }
        }

        public static List<T> DataTableToList<T>(this IEnumerable<DataRow> rows) where T : class, new()
        {
            try
            {
                List<T> list = new List<T>();

                foreach (var row in rows)
                {
                    T obj = new T();

                    foreach (var prop in obj.GetType().GetProperties())
                    {
                        try
                        {
                            System.Reflection.PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);
                            if (rows.FirstOrDefault().Table.Columns.Contains(prop.Name) && propertyInfo != null && row[prop.Name] != DBNull.Value)
                            {
                                int enumValue;

                                if (propertyInfo.PropertyType == typeof(Guid) || propertyInfo.PropertyType == typeof(Guid?))
                                    propertyInfo.SetValue(obj, Guid.Parse(row[prop.Name].ToString()), null);
                                else if (propertyInfo.PropertyType.BaseType == typeof(Enum) && int.TryParse(row[prop.Name].ToString(), out enumValue))
                                    propertyInfo.SetValue(obj, Enum.Parse(propertyInfo.PropertyType, enumValue.ToString()), null);
                                else
                                    propertyInfo.SetValue(obj, Convert.ChangeType(row[prop.Name], Nullable.GetUnderlyingType(propertyInfo.PropertyType) ?? propertyInfo.PropertyType), null);
                            }
                        }
                        catch
                        {
                            continue;
                        }
                    }
                    list.Add(obj);
                }

                return list;

            }
            catch
            {
                return null;
            }
        }
    }
}
