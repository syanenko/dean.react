using UnityEngine;
using System.Collections;

public class Rock : MonoBehaviour
{
	public Transform Center;

	private Vector3 offset;
	// Vector3 screenSpace;

	void Start ()
	{
		Vector3 ancorPosition = transform.position - Center.transform.position;

		SpringJoint spring = this.GetComponent<SpringJoint>();
		spring.connectedAnchor = ancorPosition;
	}
	
	void Update ()
	{
	}

	void OnMouseDown()
	{
	  //  screenSpace = Camera.main.WorldToScreenPoint(transform.position);
	  //  offset = transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x,Input.mousePosition.y, screenSpace.z));

		offset = transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x,Input.mousePosition.y, 0));
	}
	
	void OnMouseDrag ()
	{
		//	Vector3 curScreenSpace = new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenSpace.z);
		Vector3 curScreenSpace = new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0);
		Vector3 curPosition = Camera.main.ScreenToWorldPoint(curScreenSpace) + offset;
		transform.position = curPosition;
	}
}