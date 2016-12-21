using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using SimpleCMS.Models;

namespace SimpleCMS.Validations
{
    public class IncludedInCategory : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            int id = Convert.ToInt32(value);
            if (id == -1) return ValidationResult.Success;
            if (id >= 10000)
            {
                using (var ctx = new SimpleCMSContext())
                {
                    var q = ctx.T_Category.SingleOrDefault(m => m.CategoryId == id & m.State == 0);
                    if (q != null) return ValidationResult.Success;
                }
            }
            var errorMessage = FormatErrorMessage(validationContext.DisplayName);
            return new ValidationResult(errorMessage);
        }
        
    }
}