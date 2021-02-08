using UnityEngine;
using System.Collections;

public class Owl : MonoBehaviour
{
    public float OWL_TIMEVAL_MIN = 0.3F;
    public float OWL_TIMEVAL_MAX = 5F;

    float OWL_TIMEVAL;
    float owlTimer;

    static GameObject Owl_head = null;
    static GameObject Owl_head_eye_closed = null;

    //
    // Touch owl
    //
    void TouchOwl()
    {
        Debug.Log("TouchOwl() !");

        Owl_head.SetActive(!Owl_head.activeSelf);
        Owl_head_eye_closed.SetActive(!Owl_head_eye_closed.activeSelf);

        if (OWL_TIMEVAL == OWL_TIMEVAL_MIN)
        {
            OWL_TIMEVAL = Random.Range(OWL_TIMEVAL_MIN, OWL_TIMEVAL_MAX);
        }
        else
        {
            OWL_TIMEVAL = OWL_TIMEVAL_MIN;
        }

        owlTimer = 0;
    }


    //
    // Init owl
    //
    void InitOwl()
    {
        if (Owl_head_eye_closed == null)
        {
            Owl_head_eye_closed = GameObject.Find("Owl_head_eye_closed");
            Debug.Log(Owl_head_eye_closed.name);
            Owl_head_eye_closed.SetActive(false);
        }

        if (Owl_head == null)
        {
            Owl_head = GameObject.Find("Owl_head");
            Debug.Log(Owl_head.name);
        }

        // Init timer
        OWL_TIMEVAL = OWL_TIMEVAL_MAX;
        owlTimer = 0;
    }


    void Start()
    {
        InitOwl();
    }

    //
    // Mouse
    //
    void OnMouseDown()
    {
        TouchOwl();
    }

    //
    // Timer
    //
    void CheckTimers()
    {
        owlTimer += Time.deltaTime;
        if (owlTimer >= OWL_TIMEVAL)
        {
            TouchOwl();
            Debug.Log("TouchOwl() from timer !");
        }
    }

    //
    // Update
    //
    void Update()
    {
        CheckTimers();
    }
}
