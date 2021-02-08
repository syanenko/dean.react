using UnityEngine;
using System.Collections;

public class Exit : MonoBehaviour {

	void Update ()
	{
		if (Input.GetKeyDown(KeyCode.Escape))
		{
            Debug.Log("Quit !");
            
            // Ask via dialog here
			Application.Quit();
		}
	}
}
