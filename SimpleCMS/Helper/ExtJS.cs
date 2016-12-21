using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using System.Linq.Dynamic;

namespace SimpleCMS.Helper
{
    public class ExtJS
    {
        public static JObject WriterJObject(
            bool success,
            JObject errors = null,
            int? total = null,
            string msg = null,
            object data = null
            )
        {
            JObject jo = new JObject(
                new JProperty("success", success)
                );
            if (errors != null)
            {
                jo.Add(new JProperty("errors", errors));
            }
            if (total != null)
            {
                jo.Add(new JProperty("total", total));
            }
            if (msg != null)
            {
                jo.Add(new JProperty("msg", msg));
            }
            if (data != null)
            {
                jo.Add(new JProperty("data", data));
            }
            return jo;
        }

        public static JObject ModelStateToJObject(ModelStateDictionary ModelState)
        {
            JObject errors = new JObject();
            var q = ModelState.Where(m => !ModelState.IsValidField(m.Key)).Select(m=>m.Key);
            foreach (var c in q)
            {
                errors.Add(new JProperty(c, string.Join("<br/>" , 
                    ModelState[c].Errors.Select(m => m.ErrorMessage))));                    
            }
            return errors;
        }

        public static string parseSorter(string[] fields, string sorter, string defaultSort, string keyFieldName)
        {
            if (string.IsNullOrEmpty(sorter)) return defaultSort;
            JArray ja = JArray.Parse(sorter);
            string result = "";
            foreach (JObject c in ja)
            {
                string field = (string)c["property"];
                field = field == "id" ? keyFieldName : field;
                if (fields.Contains(field))
                {
                    result += string.Format("it.{0} {1},", field, (string)c["direction"] == "ASC" ? "" : "DESC");
                }
            }
            return result.Length > 0 ? result.Substring(0, result.Length - 1) : defaultSort;
        }

        public static JObject parseDataToJObject(string data)
        {
            if (string.IsNullOrEmpty(data))
            {
                return new JObject();
            }
            JArray ja = JArray.Parse(data);
            if (ja.Count > 0)
            {
                return (JObject)ja[0];
            }
            else
            {
                return new JObject();
            }
        }

        public static List<T> splitStringToList<T>(string splitString, char[] separator)
        {
            if (String.IsNullOrEmpty(splitString))
            {
                return new List<T>();
            }
                return new List<T>(splitString.Split(separator, StringSplitOptions.RemoveEmptyEntries)
                    .Select(m=>(T)Convert.ChangeType(m,typeof(T))));
        }

        private static string[] operatorString = new string[] { "<", "<=", ">", ">=", "==", "!=", "Contains", "StartsWith", "EndsWith", "Equals" };

        public static void parseFilter<T>(IList<SearchObject> searchObject, string filterString, ref IQueryable<T> queryObject)
        {
            if (string.IsNullOrEmpty(filterString)) return;
            JArray filters = JArray.Parse(filterString);
            foreach (JObject c in filters)
            {
                string field = (string)c["property"];
                if (string.IsNullOrEmpty(field)) continue;
                var search = searchObject.SingleOrDefault(m => m.Field.Equals(field));
                if (search != null)
                {
                    string searchString = search.SearchString;
                    string op = (string)c["operator"];
                    if (!string.IsNullOrEmpty(op) && operatorString.Contains(op))
                    {
                        searchString = string.Format(searchString, op);
                    }
                    queryObject = queryObject.Where(searchString, Convert.ChangeType((string)c["value"], search.FieldType));
                }
            }
        }


    }

    public class SearchObject
    {
        public string Field { get; set; }
        public string SearchString { get; set; }
        public Type FieldType { get; set; }
    }

}