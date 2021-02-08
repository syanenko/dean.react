using UnityEngine;
using System.Collections;

public class BridgeRock : MonoBehaviour
{
    //
    // Mouse
    //
    private Vector3 offset;

    void OnMouseDown()
    {
        offset = transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0));
    }

    void OnMouseDrag()
    {
        transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0)) + offset;
    }

    void Start ()
    {
        	
	}
	
	void Update ()
    {
	
	}
}
