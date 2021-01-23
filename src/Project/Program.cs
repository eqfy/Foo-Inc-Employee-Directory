using Amazon.CDK;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Project
{
    sealed class Program
    {
        public static void Main(string[] args)
        {
            var app = new App();
            new ProjectStack(app, "ProjectStack");
            app.Synth();   
        }
    }
}
