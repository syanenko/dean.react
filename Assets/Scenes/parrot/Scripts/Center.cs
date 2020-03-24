using UnityEngine;
using System.Collections;

public class Center : MonoBehaviour
{
	void Update ()
	{
		GetComponent<Renderer>().enabled = false;
	}
}
